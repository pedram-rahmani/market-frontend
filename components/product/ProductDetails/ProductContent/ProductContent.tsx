import { Product, ProductIntroduction } from "@/types/product";

export default function ProductContent({ product }: { product: Product }) {
  const introductions = product?.introductions || [];
  const hasDescription = Boolean(product?.description);

  if (!hasDescription && introductions.length === 0) return null;

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
        <h2 className="text-xl font-bold text-text-on-light dark:text-text-on-dark/90 tracking-tight">
          بررسی تخصصی و توضیحات محصول
        </h2>
      </div>

      <div className="bg-white/80 dark:bg-dark-700/70 border border-slate-200/80 dark:border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md space-y-6 shadow-sm">
        {hasDescription && (
          <div className="bg-cyan-500/5 border-r-4 border-r-cyan-400 p-4 md:p-5 rounded-2xl border border-cyan-500/10">
            <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mb-1">
              خلاصه بررسی
            </h3>
            <p className="text-slate-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {introductions.length > 0 && (
          <div className="space-y-5 pt-2 mb-2">
            {introductions.map((block: ProductIntroduction) => {
              // headings
              if (block.type === "heading") {
                return (
                  <h3
                    key={block.id}
                    className="text-lg font-bold text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-white/5 first:border-0 first:pt-0"
                  >
                    {block.title || block.content}
                  </h3>
                );
              }

              // lists
              if (block.type === "list") {
                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-3.5 rounded-xl border border-slate-200/50 dark:border-white/5"
                  >
                    <span className="size-2 bg-cyan-400 rounded-full mt-2 shrink-0 shadow-[0_0_8px_#22d3ee]" />
                    <p className="text-slate-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                      {block.content}
                    </p>
                  </div>
                );
              }

              // text blocks
              return (
                <p
                  key={block.id}
                  className="text-slate-600 dark:text-gray-300 text-sm md:text-base leading-relaxed md:leading-8 font-normal whitespace-pre-line"
                >
                  {block.content}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
