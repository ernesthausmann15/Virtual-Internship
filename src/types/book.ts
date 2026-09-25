/**
 * Shape returned by the Summarist cloud functions.
 * Field names stay identical to the API so we never remap a payload
 * and accidentally drop `subscriptionRequired` (that flag gates premium books).
 */
export type BookStatus = "selected" | "recommended" | "suggested";

export interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: BookStatus | string;
  subscriptionRequired: boolean;
  summary: string;
  tags?: string[];
  bookDescription?: string;
  authorDescription?: string;
}
