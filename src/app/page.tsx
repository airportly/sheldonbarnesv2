import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Expertise from "@/components/Expertise";
import Author from "@/components/Author";
import Books from "@/components/Books";
import KeyIdeas from "@/components/KeyIdeas";
import Resources from "@/components/Resources";
import AiAssistant from "@/components/AiAssistant";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Author />
        <Books />
        <KeyIdeas />
        <Resources />
        <AiAssistant />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
