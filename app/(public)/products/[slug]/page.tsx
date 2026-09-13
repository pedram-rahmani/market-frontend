import ProductInfo from "@/components/product/ProductDetails/ProductOverview/ProductInfo/ProductInfo";
import ProductSpecs from "@/components/product/ProductDetails/ProductOverview/ProductSpecs/ProductSpecs";
import ProductContent from "@/components/product/ProductDetails/ProductContent/ProductContent";
import ReviewSection from "@/components/product/ProductDetails/ReviewSection/ReviewSection";
import QuestionSection from "@/components/product/ProductDetails/QuestionSection/QuestionSection";
import Breadcrumb from "@/components/ui/BreadCrumb/BreadCrumb";
import ProductGallery, {
  GalleryMedia,
} from "@/components/product/ProductDetails/ProductGallery/ProductGallery";

import { getProduct } from "@/services/product";
import axiosInstance from "@/lib/axiosInstance";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductQuestions(productId: number | string) {
  try {
    const res = await axiosInstance.get(`/products/${productId}/questions`);
    return res.data;
  } catch (error) {
    return [];
  }
}

async function getProductReviews(productId: number | string) {
  try {
    const res = await axiosInstance.get(`/products/${productId}/reviews`);
    return res.data;
  } catch (error) {
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-400">Product not found.</div>
    );
  }

  const productIdNum = Number(product.id);

  const productQuestions =
    product.questions || (await getProductQuestions(product.id));

  const productReviews =
    product.reviews || (await getProductReviews(product.id));

  const officialImages: GalleryMedia[] = [
    ...(product?.img
      ? [
          {
            id: "main-img",
            type: "image" as const,
            url: product.img,
            source: "official" as const,
          },
        ]
      : []),
    ...(Array.isArray(product?.gallery)
      ? product.gallery.map((imgUrl: string, idx: number) => ({
          id: `gallery-${idx}`,
          type: "image" as const,
          url: imgUrl,
          source: "official" as const,
        }))
      : []),
  ];

  const userMediaItems: GalleryMedia[] = [];
  if (Array.isArray(productReviews)) {
    productReviews.forEach((review: any) => {
      if (Array.isArray(review.media)) {
        review.media.forEach((m: any) => {
          const isApproved = m.is_approved === 1 || m.is_approved === true;
          if (isApproved) {
            userMediaItems.push({
              id: `user-media-${m.id}`,
              type: m.file_type === "video" ? "video" : "image",
              url: m.file_path,
              thumbnail: m.file_type === "video" ? (product?.img || undefined) : undefined,
              source: "user",
              userName: review.user?.name || "کاربر مهمان",
              comment: review.comment,
              likes_count: review.likes_count || 0,
              dislikes_count: review.dislikes_count || 0,
              user_reaction: review.user_reaction || null,
            });
          }
        });
      }
    });
  }

  const allMediaItems: GalleryMedia[] = [...officialImages, ...userMediaItems];

  return (
    <main className="max-w-7xl p-4 md:p-8 relative text-white mx-auto overflow-x-hidden w-full box-border">
      <Breadcrumb
        links={[
          { id: "search", title: "جستجو", to: "/search" },
          { id: "product-title", title: product?.name || "Product Name" },
        ]}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 mt-6 items-start w-full min-w-0">
        <div className="lg:col-span-6 space-y-4 w-full min-w-0 overflow-hidden">
          <div className="w-full overflow-hidden">
            <ProductGallery mediaItems={allMediaItems} />
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3 bg-white/80 dark:bg-dark-700/70 border border-custom-gray-100/70 dark:border-dark-600 rounded-2xl p-3 md:p-4 text-center text-[11px] md:text-xs text-text-on-light/80 dark:text-text-on-dark/90">
            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
              </span>
              <span className="font-medium truncate w-full">ارسال سریع</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span className="font-medium truncate w-full">ضمانت اصالت کالا</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </span>
              <span className="font-medium truncate w-full">۷ روز ضمانت بازگشت</span>
            </div>
          </div>
        </div>

        {/* ستون دوم: اطلاعات (6 ستون برای تکمیل 12 ستون گرید) */}
        <div className="lg:col-span-6 space-y-6 w-full min-w-0 overflow-hidden">
          <ProductInfo product={product} />
          <ProductSpecs product={product} />
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-white/10 space-y-12 w-full overflow-hidden">
        <ProductContent product={product} />
        <QuestionSection questions={productQuestions} productId={productIdNum} />
        <ReviewSection productId={productIdNum} />
      </div>
    </main>
  );
}