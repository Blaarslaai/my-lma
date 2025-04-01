import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/sidebar";
import { AppProvider } from "./utils/AppContext";
import { cookies } from "next/headers";
import CookieBanner from "./components/cookieBanner";
import { ThemeProvider } from "./components/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-60 -z-10"></div>
              <SidebarProvider defaultOpen={defaultOpen}>
                <div className="flex min-h-screen w-full">
                  {/* Sidebar */}
                  <AppSidebar />

                  {/* Main Content Area */}
                  <div className="flex flex-col flex-grow w-full">
                    {/* Main Content */}
                    <main className="flex-grow p-4 relative z-10">
                      <SidebarTrigger />
                      <div className="mt-5">{children}</div>
                    </main>

                    {/* Footer */}
                    <footer className="mt-auto">
                      <Footer />
                    </footer>
                  </div>
                </div>

                {/* Cookie Banner (Global, not inside flex containers) */}
                <CookieBanner />
              </SidebarProvider>
            </div>
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
