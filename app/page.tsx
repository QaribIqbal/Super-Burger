import Header from "@/components/Header";
import ScrollySection from "@/components/ScrollySection";
import USP from "@/components/USP";
import SignaturePicks from "@/components/SignaturePicks";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Scrollytelling hero — 400vh scroll track with sticky canvas */}
        <ScrollySection />

        {/* Downstream sections */}
        <USP />
        <SignaturePicks />
        <About />
        <Gallery />
        <Location />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}