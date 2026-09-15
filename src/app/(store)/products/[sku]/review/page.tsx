import type { Metadata } from "next";
import WriteReviewView from "@/components/product/WriteReviewView";
import { getProductBySku } from "@/lib/api/products";
import { getDemoProductDetail } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Write a Review - Atlas Marketplace",
};

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const demo = getDemoProductDetail(sku);
  let name = demo?.name;
  let image = demo?.image;
  if (!name) {
    try {
      const product = await getProductBySku(sku);
      name = product.name;
      image = product.images[0]?.url;
    } catch {
      // Offline or unknown SKU: the form still works with the SKU as the title.
    }
  }
  return <WriteReviewView sku={sku} name={name ?? sku} image={image ?? "/images/product-placeholder.svg"} />;
}
