
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import PropertyGrid from "@/components/PropertyGrid";
import AboutUs from "@/components/AboutUs";
import OurVision from "@/components/OurVision";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <section id="properties" className="py-32">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-5xl font-display text-estate-800 mb-16">Discover</h2>
          <PropertyGrid />
          <div className="mt-12 text-center">
            <Link to="/properties">
              <button className="px-8 py-3 bg-estate-800 text-white rounded-md hover:bg-estate-700 transition-colors">
                View All Properties
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div id="about">
        <AboutUs />
        <OurVision />
      </div>
      
      <div id="testimonials">
        <Testimonials />
      </div>
      
      <div id="contact" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-5xl font-display text-estate-800 mb-8">Get In Touch</h2>
          <p className="text-lg text-estate-600 mb-12 max-w-2xl mx-auto">
            Have questions about our properties or services? We'd love to hear from you.
          </p>
          <Link to="/contact">
            <button className="px-8 py-3 bg-estate-800 text-white rounded-md hover:bg-estate-700 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
