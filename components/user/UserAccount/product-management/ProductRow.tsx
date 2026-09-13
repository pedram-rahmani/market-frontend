"use client";

export default function ProductRow({ product, onDelete, onEdit, permissions, className }: any) {
  
  const Icons = {
    Edit: () => (
      <svg className="size-3.5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    Trash: () => (
      <svg className="size-3.5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  };

  const editClass = permissions.canEdit 
    ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-500/10 dark:bg-violet-400/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer" 
    : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed";

  const deleteClass = permissions.canDelete 
    ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 dark:bg-red-400/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer" 
    : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed";

  return (
    <div className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 mt-2 flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-dark-900/20 ${className}`}>
      
      {/* img/name */}
      <div className="flex items-center gap-4 flex-1">
        <img 
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${product.img}`} 
          className="w-14 h-14 rounded-xl object-cover" 
          alt={product.name} 
        />
        <div className="flex flex-col">
          <p className="font-bold text-sm text-gray-800 dark:text-white">{product.name}</p>
          <span className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {product.id}</span>
        </div>
      </div>

      {/* price/discount */}
      <div className="flex justify-between md:justify-end gap-6 md:flex-1">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400">قیمت</span>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{Number(product.price).toLocaleString()}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-400">تخفیف</span>
          <p className={`text-sm font-bold ${product.discount ? "text-red-500" : "text-gray-300"}`}>
            {product.discount ? `${product.discount}%` : '-'}
          </p>
        </div>
      </div>

      {/* btns */}
      <div className="flex gap-2.5 md:justify-end md:flex-1 items-center">
        <button 
          onClick={() => onEdit(product)} 
          disabled={!permissions.canEdit} 
          className={editClass}
        >
          <Icons.Edit /> ویرایش
        </button>
        <button 
          onClick={() => onDelete(product.id)} 
          disabled={!permissions.canDelete} 
          className={deleteClass}
        >
          <Icons.Trash /> حذف
        </button>
      </div>
    </div>
  );
}