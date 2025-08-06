import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Sessions from "@/components/Sessions";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Sessions />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
