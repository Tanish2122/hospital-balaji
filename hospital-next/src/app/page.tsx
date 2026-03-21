import Hero from "@/components/home/Hero";
import Departments from "@/components/home/Departments";
import Facilities from "@/components/home/Facilities";
import Doctors from "@/components/home/Doctors";
import Treatments from "@/components/home/Treatments";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Departments />
      <Facilities />
      <Doctors />
      <Treatments />
      <Stats />
      <Testimonials />
      <Contact />
    </main>
  );
}
