import type { Metadata, Viewport } from "next";
import { Caveat, Archivo_Black, Work_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Super Burger Co. — Built Right.",
  description: "Fresh-grilled, double-stacked burgers built layer by layer. Order Super Burger Co. for delivery or pickup.",
  openGraph: {
    title: "Super Burger Co. — Built Right.",
    description: "Fresh-grilled, double-stacked burgers built layer by layer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3E4C4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      className={`${caveat.variable} ${archivoBlack.variable} ${workSans.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/images/burger-build/frame-001.webp?v=burger-frames-2026-09-08-webp-1"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
