
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-5xl font-display text-estate-800 mb-8 text-center animate-fade-in-up">Contact Us</h1>
          <p className="text-center text-estate-600 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Please fill in the information below and we'll get back to you as soon as possible.
          </p>
          <div className="max-w-xl mx-auto animate-scale-in" style={{ animationDelay: "200ms" }}>
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
