
import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import OurVision from "@/components/OurVision";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32">
        <AboutUs />
        <OurVision />
      </div>
      <Footer />
    </div>
  );
};

export default About;
