import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { NotFoundException } from '@nestjs/common'
import { RestaurantService } from '../restaurant.service.js'
import type {
  IRestaurantClient,
  IUserAuthClient,
  Restaurant,
  Review,
} from '@/types'

const baseRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: 'rest-1',
  name: 'Test Restaurant',
  cuisine: 'Italian',
  location: 'Vancouver, BC',
  isVerified: false,
  createdAt: new Date('2026-07-01'),
  ...overrides,
})

const review = (
  id: string,
  restaurantId: string,
  userId: string,
  rating: number,
): Review => ({
  id,
  restaurantId,
  userId,
  rating,
  isValid: true,
  createdAt: new Date('2026-07-01'),
})

describe('RestaurantService.verify', () => {
  let restaurantClient: {
    getRestaurantById: Mock<IRestaurantClient['getRestaurantById']>
    getReviewsByRestaurantId: Mock<
      IRestaurantClient['getReviewsByRestaurantId']
    >
    updateVerificationStatus: Mock<
      IRestaurantClient['updateVerificationStatus']
    >
  }
  let userAuthClient: IUserAuthClient
  let service: RestaurantService

  beforeEach(() => {
    restaurantClient = {
      getRestaurantById: vi.fn<IRestaurantClient['getRestaurantById']>(),
      getReviewsByRestaurantId:
        vi.fn<IRestaurantClient['getReviewsByRestaurantId']>(),
      updateVerificationStatus:
        vi.fn<IRestaurantClient['updateVerificationStatus']>(),
    }
    userAuthClient = { getUserById: vi.fn() }
    service = new RestaurantService(
      restaurantClient as unknown as IRestaurantClient,
      userAuthClient,
    )
  })

  it('should throw NotFoundException when the restaurant does not exist', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(null)

    await expect(service.verify('missing')).rejects.toThrow(NotFoundException)
    expect(restaurantClient.getReviewsByRestaurantId).not.toHaveBeenCalled()
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should return already verified when the restaurant is verified', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-1', isVerified: true }),
    )

    const result = await service.verify('rest-1')

    expect(result).toMatchObject({
      restaurantId: 'rest-1',
      isVerified: true,
      totalReviews: 0,
      validReviews: 0,
      distinctUsers: 0,
      averageRating: 0,
    })
    expect(restaurantClient.getReviewsByRestaurantId).not.toHaveBeenCalled()
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should verify a restaurant meeting the review criteria', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-4' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-4', 'u1', 4.5),
      review('r2', 'rest-4', 'u2', 4.0),
      review('r3', 'rest-4', 'u3', 3.5),
      review('r4', 'rest-4', 'u4', 5.0),
      review('r5', 'rest-4', 'u5', 4.0),
    ])

    const result = await service.verify('rest-4')

    expect(result.isVerified).toBe(true)
    expect(result.totalReviews).toBe(5)
    expect(result.distinctUsers).toBe(5)
    expect(result.averageRating).toBe(4.2)
    expect(restaurantClient.updateVerificationStatus).toHaveBeenCalledWith(
      'rest-4',
      true,
    )
  })

  it('should not verify when there are fewer than five reviews', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-1' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-1', 'u1', 4.0),
      review('r2', 'rest-1', 'u2', 3.5),
      review('r3', 'rest-1', 'u3', 3.0),
      review('r4', 'rest-1', 'u4', 4.0),
    ])

    const result = await service.verify('rest-1')

    expect(result.isVerified).toBe(false)
    expect(result.totalReviews).toBe(4)
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should not verify when reviews come from fewer than five users', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-3' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-3', 'u1', 4.0),
      review('r2', 'rest-3', 'u2', 4.0),
      review('r3', 'rest-3', 'u1', 4.0),
      review('r4', 'rest-3', 'u2', 4.0),
      review('r5', 'rest-3', 'u1', 4.0),
    ])

    const result = await service.verify('rest-3')

    expect(result.distinctUsers).toBe(2)
    expect(result.isVerified).toBe(false)
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should not verify when the average rating is below the threshold', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-2' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-2', 'u1', 2.0),
      review('r2', 'rest-2', 'u2', 2.0),
      review('r3', 'rest-2', 'u3', 2.0),
      review('r4', 'rest-2', 'u4', 2.0),
      review('r5', 'rest-2', 'u5', 2.0),
    ])

    const result = await service.verify('rest-2')

    expect(result.averageRating).toBe(2)
    expect(result.isVerified).toBe(false)
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should ignore invalid reviews when computing verification', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-5' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-5', 'u1', 4.5),
      { ...review('r2', 'rest-5', 'u2', 4.0), isValid: false },
      review('r3', 'rest-5', 'u3', 4.0),
      review('r4', 'rest-5', 'u4', 4.0),
      review('r5', 'rest-5', 'u5', 4.0),
    ])

    const result = await service.verify('rest-5')

    expect(result.validReviews).toBe(4)
    expect(result.isVerified).toBe(false)
    expect(restaurantClient.updateVerificationStatus).not.toHaveBeenCalled()
  })

  it('should verify exactly at the threshold boundary', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({ id: 'rest-6' }),
    )
    restaurantClient.getReviewsByRestaurantId.mockResolvedValue([
      review('r1', 'rest-6', 'u1', 2.5),
      review('r2', 'rest-6', 'u2', 2.5),
      review('r3', 'rest-6', 'u3', 2.5),
      review('r4', 'rest-6', 'u4', 2.5),
      review('r5', 'rest-6', 'u5', 2.5),
    ])

    const result = await service.verify('rest-6')

    expect(result.totalReviews).toBe(5)
    expect(result.distinctUsers).toBe(5)
    expect(result.averageRating).toBe(2.5)
    expect(result.isVerified).toBe(true)
    expect(restaurantClient.updateVerificationStatus).toHaveBeenCalledWith(
      'rest-6',
      true,
    )
  })
})

describe('RestaurantService.checkData', () => {
  let restaurantClient: {
    getRestaurantById: Mock<IRestaurantClient['getRestaurantById']>
    getReviewsByRestaurantId: Mock<
      IRestaurantClient['getReviewsByRestaurantId']
    >
    updateVerificationStatus: Mock<
      IRestaurantClient['updateVerificationStatus']
    >
  }
  let userAuthClient: IUserAuthClient
  let service: RestaurantService

  beforeEach(() => {
    restaurantClient = {
      getRestaurantById: vi.fn<IRestaurantClient['getRestaurantById']>(),
      getReviewsByRestaurantId:
        vi.fn<IRestaurantClient['getReviewsByRestaurantId']>(),
      updateVerificationStatus:
        vi.fn<IRestaurantClient['updateVerificationStatus']>(),
    }
    userAuthClient = { getUserById: vi.fn() }
    service = new RestaurantService(
      restaurantClient as unknown as IRestaurantClient,
      userAuthClient,
    )
  })

  it('should flag a restaurant whose data contains an offensive word', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({
        id: 'rest-7',
        name: 'Trash Bin Burgers',
        cuisine: 'American',
      }),
    )

    const result = await service.checkData('rest-7')

    expect(result.dataStatus).toBe('flagged')
    expect(result.flaggedWords).toContain('trash')
  })

  it('should report verified for a restaurant with clean data', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(
      baseRestaurant({
        id: 'rest-8',
        name: 'Golden Garden',
        cuisine: 'Italian',
        location: 'Vancouver, BC',
      }),
    )

    const result = await service.checkData('rest-8')

    expect(result.dataStatus).toBe('verified')
    expect(result.flaggedWords).toEqual([])
  })

  it('should throw NotFoundException when the restaurant does not exist', async () => {
    restaurantClient.getRestaurantById.mockResolvedValue(null)

    await expect(service.checkData('missing')).rejects.toThrow(
      NotFoundException,
    )
  })
})
