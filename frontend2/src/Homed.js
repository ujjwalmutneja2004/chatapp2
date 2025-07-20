// Import necessary components
import React from 'react';
import Navbar from './components/Home/Navbar.jsx';
import Header from './components/Home/Header.jsx';
import Team from './components/Home/Team.jsx';
import Cta from './components/Home/Cta.jsx';
import Footer from './components/Home/Footer.jsx';
import Service from "./components/Home/Service.jsx";
import { useEffect } from 'react';

export default function HomePag() {
    useEffect(() => {
    // ✅ Enable scroll on HomePag mount
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
  }, []);

  return (
    <div className="HomePage">
      <Navbar />
      <Header />
      <Cta />
      <Service />
      <Team />
      <Footer />
    </div>
  );
}
