import React from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div>
      <Header />
      <Hero
        title="Welcome to My App"
        description="Your one-stop solution for managing your inventory"
        buttonText="Get Started"
      />
      <MainContent />
      <Footer />
    </div>
  );
}
