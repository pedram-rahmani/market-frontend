import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b18] px-4 py-16 text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 size-112 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(148,163,184,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.12)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <section className="relative w-full max-w-2xl">
        <div className="mb-7 flex items-center justify-between px-1 text-[11px] text-slate-500">
          <span className="font-mono tracking-[0.3em]">ERROR / NOT_FOUND</span>
          <span className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
            مسیر نامعتبر
          </span>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-violet-950/40 backdrop-blur-xl sm:p-10">
          <div className="absolute -left-16 -top-16 size-40 rounded-full border border-violet-400/20" />
          <div className="absolute -left-9 -top-9 size-26 rounded-full border border-violet-400/10" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-2 text-right sm:order-1 sm:max-w-sm">
              <p className="mb-4 text-sm font-bold text-cyan-300">اینجا چیزی پیدا نشد</p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl">
                این مسیر به جایی نمی‌رسد
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                آدرس واردشده وجود ندارد یا صفحه از دسترس خارج شده است. می‌توانید به خانه برگردید و دوباره جست‌وجو کنید.
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-200"
              >
                <span>بازگشت به خانه</span>
                <span aria-hidden="true">←</span>
              </Link>
            </div>

            <div className="order-1 flex shrink-0 items-center justify-center sm:order-2">
              <div className="relative flex size-40 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/5 shadow-[0_0_80px_rgba(34,211,238,.12)] sm:size-52">
                <div className="absolute inset-4 rounded-full border border-dashed border-violet-300/30" />
                <div className="text-center">
                  <div className="bg-linear-to-br from-cyan-200 via-violet-400 to-fuchsia-500 bg-clip-text text-6xl font-black tracking-tighter text-transparent sm:text-7xl">
                    404
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.35em] text-slate-500">
                    LOST SIGNAL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
