import ScrollySection from "@/components/ScrollySection";
import USP from "@/components/USP";
import BurgerExplosionSection from "@/components/BurgerExplosionSection";
import SignaturePicks from "@/components/SignaturePicks";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <main id="main-content">
        {/* Scrollytelling hero — 400vh scroll track with sticky canvas */}
        <ScrollySection />

        {/* Downstream sections */}
        <USP />
        <BurgerExplosionSection />
        <SignaturePicks />
        <About />
        <Gallery />
        <Location />
        <FinalCTA />
      </main>
    </>
  );
}
