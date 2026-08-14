import { Injectable, NotFoundException } from '@nestjs/common'
import type { MediaItem } from '@/types'

interface MediaAction {
  mediaId: string
  verified: boolean
  at: number
}

const ACTION_LIMIT = 200

const seedMedia: MediaItem[] = [
  {
    id: 'med-1',
    restaurantId: 'rest-1',
    restaurantName: 'Sushi Heaven',
    url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Fresh salmon nigiri plate',
    isVerified: true,
    createdAt: new Date('2026-07-02'),
  },
  {
    id: 'med-2',
    restaurantId: 'rest-1',
    restaurantName: 'Sushi Heaven',
    url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Interior seating area',
    isVerified: false,
    createdAt: new Date('2026-07-03'),
  },
  {
    id: 'med-3',
    restaurantId: 'rest-2',
    restaurantName: 'Pasta Palace',
    url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Carbonara pasta bowl',
    isVerified: true,
    createdAt: new Date('2026-06-16'),
  },
  {
    id: 'med-4',
    restaurantId: 'rest-3',
    restaurantName: 'Curry House',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Butter chicken with naan',
    isVerified: false,
    createdAt: new Date('2026-07-11'),
  },
  {
    id: 'med-5',
    restaurantId: 'rest-4',
    restaurantName: 'Burger Barn',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Classic cheeseburger',
    isVerified: true,
    createdAt: new Date('2026-07-21'),
  },
  {
    id: 'med-6',
    restaurantId: 'rest-4',
    restaurantName: 'Burger Barn',
    url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Milkshake special',
    isVerified: false,
    createdAt: new Date('2026-07-22'),
  },
  {
    id: 'med-7',
    restaurantId: 'rest-5',
    restaurantName: 'Le Petit Bistro',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    type: 'image',
    title: 'Duck confit plated dinner',
    isVerified: true,
    createdAt: new Date('2026-05-22'),
  },
]

@Injectable()
export class MediaService {
  private readonly media: MediaItem[] = seedMedia.map((m) => ({
    ...m,
    createdAt: new Date(m.createdAt),
  }))
  private readonly actions: MediaAction[] = []

  list(): MediaItem[] {
    return this.media
  }

  setVerified(mediaId: string, isVerified: boolean): MediaItem {
    const media = this.media.find((m) => m.id === mediaId)
    if (!media) throw new NotFoundException(`Media '${mediaId}' not found`)
    if (media.isVerified !== isVerified) {
      media.isVerified = isVerified
      this.actions.push({ mediaId, verified: isVerified, at: Date.now() })
      if (this.actions.length > ACTION_LIMIT) this.actions.shift()
    }
    return media
  }

  undo(mediaId: string): MediaItem {
    const index = this.lastIndex(mediaId)
    if (index === -1) {
      throw new NotFoundException(
        'No recent moderation action to undo for this media',
      )
    }
    const action = this.actions[index]!
    this.actions.splice(index, 1)
    const media = this.media.find((m) => m.id === mediaId)
    if (!media) throw new NotFoundException(`Media '${mediaId}' not found`)
    media.isVerified = !action.verified
    return media
  }

  hasUndo(mediaId: string): boolean {
    return this.lastIndex(mediaId) !== -1
  }

  private lastIndex(mediaId: string): number {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      if (this.actions[i]!.mediaId === mediaId) return i
    }
    return -1
  }
}
