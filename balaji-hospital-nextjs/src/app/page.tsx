import Hero from "@/components/home/Hero";
import Departments from "@/components/home/Departments";
import Facilities from "@/components/home/Facilities";
import Doctors from "@/components/home/Doctors";
import Stats from "@/components/home/Stats";
import Process from "@/components/home/Process";
import Insurance from "@/components/home/Insurance";
import Blog from "@/components/home/Blog";
import SocialMedia from "@/components/home/SocialMedia";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";
import AnatomyExplorer from "@/components/home/AnatomyExplorer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Process />
      <Departments />
      <Facilities />
      <AnatomyExplorer />
      <Stats />
      <Doctors />
      <Insurance />
      <Blog />
      <SocialMedia />
      <Testimonials />
      <Contact />
    </main>
  );
}
