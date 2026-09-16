import Header from "@/components/layout/desktop/Header/Header";
import Footer from "@/components/layout/desktop/Footer/Footer";
import MobileHeader from "@/components/layout/mobile/Header/Header";
import MobileMenu from "@/components/layout/mobile/Footer/Footer";
import { getCategories, getNestedCategories } from "@/services/category";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const desktopCategories = await getCategories();
  const mobileCategories = await getNestedCategories();

  return (
    <>
      <div className="hidden md:block sticky top-0 z-30">
        <Header menuItems={desktopCategories} />
      </div>

      <div className="md:hidden">
        <MobileHeader />
      </div>

      <main className="main pt-5 md:pt-0 w-full overflow-x-hidden">
        <div className="flex flex-col px-4 mx-auto w-full max-w-7xl box-border">
          {children}
        </div>
      </main>

      <div className="md:hidden">
        <MobileMenu categories={mobileCategories} />
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}