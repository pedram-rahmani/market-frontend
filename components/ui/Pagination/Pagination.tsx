export default function Pagination() {
  const pages = [1, 2, 3, "...", 10];

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {pages.map((page, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-xl border transition-all duration-300 
            ${page === 1 
              ? "bg-teal-500/20 border-teal-500/50 text-white"
              : "shadow bg-white/30 dark:bg-white/5 border-white/10 text-gray-400 hover:bg-white/60 dark:hover:bg-white/10 hover:text-text-on-light dark:hover:text-white"
            }
            backdrop-blur-md text-sm`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}