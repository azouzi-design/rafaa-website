import HeroVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="relative snap-start">
        <HeroVideo />
        <Navbar />
        <div className="absolute bottom-4 left-4 z-10 mix-blend-difference flex flex-col items-start gap-4">
          <p className="text-paragraph w-[245px] text-white">
            By Rafaa Chawali ® Creative partner who specializes in video
            marketing
          </p>
          <Logo className="h-[87px] w-[410px]" />
        </div>
      </div>

      <section id="projects" className="h-screen w-full snap-start bg-black" />

      <Footer />
    </>
  );
}
