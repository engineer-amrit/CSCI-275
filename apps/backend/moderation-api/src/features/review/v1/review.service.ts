import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import type { Review, ModeratedReview } from '@/types'

const ACTION_LIMIT = 200

interface LanguageAction {
  reviewId: string
  verified: boolean
  at: number
}

function detectLanguage(text: string): string {
  if (/[\u4e00-\u9fff]/.test(text)) return 'Chinese'
  if (/[\u3040-\u30ff]/.test(text)) return 'Japanese'
  if (/[\uac00-\ud7af]/.test(text)) return 'Korean'
  if (/[\u0600-\u06ff]/.test(text)) return 'Arabic'
  if (/[\u0900-\u097f]/.test(text)) return 'Hindi'
  if (/[\u0400-\u04ff]/.test(text)) return 'Russian'
  if (/[\u0590-\u05ff]/.test(text)) return 'Hebrew'
  const low = text.toLowerCase()
  const latinos: [RegExp, string][] = [
    [/[¿¡]/, 'Spanish'],
    [/[éèêëàç]/, 'French'],
    [/[ßüöä]/, 'German'],
    [/[àèìòù]/, 'Italian'],
  ]
  for (const [re, lang] of latinos) {
    if (re.test(low)) return lang
  }
  return 'English'
}

@Injectable()
export class ReviewService {
  private readonly verified = new Map<string, boolean>()
  private readonly actions: LanguageAction[] = []

  constructor(
    @Inject('IRestaurantClient')
    private readonly restaurantClient: {
      getReviews(): Promise<Review[]>
    },
  ) {}

  async listReviews(): Promise<ModeratedReview[]> {
    const reviews = await this.restaurantClient.getReviews()
    return reviews.map((r) => ({
      ...r,
      content: r.content ?? '',
      language: detectLanguage(r.content ?? ''),
      isLanguageVerified: this.verified.get(r.id) ?? false,
    }))
  }

  async setLanguageVerified(
    reviewId: string,
    verified: boolean,
  ): Promise<ModeratedReview> {
    const reviews = await this.listReviews()
    const review = reviews.find((r) => r.id === reviewId)
    if (!review) throw new NotFoundException(`Review '${reviewId}' not found`)

    const previous = this.verified.get(reviewId)
    if (previous === verified) return review

    this.verified.set(reviewId, verified)
    this.actions.push({ reviewId, verified, at: Date.now() })
    if (this.actions.length > ACTION_LIMIT) this.actions.shift()

    return { ...review, isLanguageVerified: verified }
  }

  async undo(reviewId: string): Promise<ModeratedReview> {
    const index = this.lastIndex(reviewId)
    if (index === -1) {
      throw new NotFoundException(
        'No recent moderation action to undo for this review',
      )
    }
    this.actions.splice(index, 1)
    const previous = this.actions
      .filter((a) => a.reviewId === reviewId)
      .slice(-1)[0]
    this.verified.set(reviewId, previous ? previous.verified : false)

    const reviews = await this.listReviews()
    const review = reviews.find((r) => r.id === reviewId)
    if (!review) throw new NotFoundException(`Review '${reviewId}' not found`)
    return {
      ...review,
      isLanguageVerified: this.verified.get(reviewId) ?? false,
    }
  }

  hasUndo(reviewId: string): boolean {
    return this.lastIndex(reviewId) !== -1
  }

  private lastIndex(reviewId: string): number {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      if (this.actions[i]!.reviewId === reviewId) return i
    }
    return -1
  }
}
