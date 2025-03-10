
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
