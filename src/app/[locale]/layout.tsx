import { Crimson_Pro, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { InstallPrompt } from "@/components/InstallPrompt/InstallPrompt";
import { Navbar } from "@/components/Navbar/Navbar";
import { PwaRegister } from "@/components/PwaRegister/PwaRegister";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/query-client-provider";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es" | "fr" | "de" | "it")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body
        className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased bg-background text-foreground min-h-full`}
      >
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster />
            <InstallPrompt />
            <PwaRegister />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
