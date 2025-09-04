import { IUser } from "./user.interface"

export interface IReview {
  id: string
  createdAt: string
  text: string
  rating: number
  user: IUser
}

export type IReviewInput = Pick<IReview, 'rating' | 'text'>