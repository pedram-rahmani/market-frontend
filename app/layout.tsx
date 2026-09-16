import "./globals.css";

import { ReduxProvider } from "@/components/providers/ReduxProvider"; 
import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f0f12] overflow-x-hidden">
        <ReduxProvider>
          <AuthProvider>
            <div id="modal-portal" />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}