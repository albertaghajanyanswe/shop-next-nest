export interface IReviewColumn {
  id: string;
  createdAt: string;
  rating: string;
  text: string;
  username: string;
}

export type IReviewInput = Pick<IReviewColumn, 'rating' | 'text'>;
