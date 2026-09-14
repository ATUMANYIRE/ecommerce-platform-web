import { apiFetch } from "@/lib/api/client";

/** GET /reviews?productId= (review-service) returns a flat array of these. */
export type ReviewResponse = {
  id: string;
  productId: string;
  customerId: string;
  orderId?: string | null;
  rating: number;
  title: string;
  body: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";
  verifiedPurchase: boolean;
  createdAt: string;
};

export function getProductReviews(productId: string, size = 10): Promise<ReviewResponse[]> {
  return apiFetch<ReviewResponse[]>(
    `/reviews?productId=${encodeURIComponent(productId)}&page=0&size=${size}`,
  );
}
