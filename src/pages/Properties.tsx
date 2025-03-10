
import Navbar from "@/components/Navbar";
import PropertyGrid from "@/components/PropertyGrid";
import Footer from "@/components/Footer";

const Properties = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl font-display text-estate-800 mb-16 text-center">Our Properties</h1>
          <PropertyGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
