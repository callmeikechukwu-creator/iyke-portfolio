import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactBar from "@/components/ui/ContactBar";
import LenisProvider from "@/components/animations/LenisProvider";
import PageTransition from "@/components/animations/PageTransition";

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      {/* Fixed navbar — transparent → frosted glass on scroll */}
      <Navbar />

      {/* Page content */}
      <main id="main-content" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global floating contact bar — floating pill + bottom-reveal bar */}
      <ContactBar />
    </LenisProvider>
  );
}
