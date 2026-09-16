interface SpecificationItem {
  id: string | number;
  value: string;
  feature?: {
    title: string;
  };
}

interface ProductSpecsProps {
  product: {
    specifications?: SpecificationItem[];
  };
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = product?.specifications;

  if (!specs || specs.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">
        مشخصات فنی برای این محصول ثبت نشده است.
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-text-on-light dark:text-text-on-dark/90 font-bold text-lg mb-2">مشخصات فنی</h3>
      
      <div className="divide-y divide-custom-gray-200 dark:divide-white/10">
        {specs.map((item, index) => (
          <div 
            key={item.id || index} 
            className="flex justify-between items-center py-3.5"
          >
            <span className="text-gray-400 text-sm font-medium">
              {item.feature?.title || "ویژگی"}
            </span>
            
            <span className="text-text-on-light/70 dark:text-text-on-dark/90 font-semibold text-sm sm:text-base text-left dir-ltr">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}