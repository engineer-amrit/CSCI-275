import { Injectable, Logger } from '@nestjs/common'
import type { IUserAuthClient, User } from '@/types'

const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'alice@example.com',
    name: 'Alice',
    role: 'user',
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'user-2',
    email: 'bob@example.com',
    name: 'Bob',
    role: 'user',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'user-3',
    email: 'carol@example.com',
    name: 'Carol',
    role: 'vendor',
    createdAt: new Date('2026-02-01'),
  },
  {
    id: 'user-4',
    email: 'dave@example.com',
    name: 'Dave',
    role: 'user',
    createdAt: new Date('2026-02-15'),
  },
  {
    id: 'user-5',
    email: 'eve@example.com',
    name: 'Eve',
    role: 'user',
    createdAt: new Date('2026-03-01'),
  },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

@Injectable()
export class MockUserAuthClient implements IUserAuthClient {
  private readonly logger = new Logger(MockUserAuthClient.name)

  async getUserById(id: string): Promise<User | null> {
    this.logger.warn(`[MOCK] GET user/${id}`)
    await delay(100)
    return mockUsers.find((u) => u.id === id) ?? null
  }
}
