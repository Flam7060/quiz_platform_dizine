import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import WhyUs from './WhyUs';
import AdditionalSections from './AdditionalSections';
import Footer from '../Common/Footer';

const HomePage = () => {
  const [showHeader, setShowHeader] = useState(false);
  const heroSectionRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroSectionBottom = heroSectionRef.current.getBoundingClientRect().bottom;
        // Показываем хедер, когда нижняя граница HeroSection уходит за верхнюю границу экрана
        setShowHeader(heroSectionBottom <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Вызываем обработчик сразу, чтобы установить начальное состояние
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="home-page">
      <div className={`header-container ${showHeader ? 'visible' : ''}`}>
        <Header />
      </div>
      <div ref={heroSectionRef}>
        <HeroSection />
      </div>
      <WhyUs />
      <AdditionalSections />
      <Footer />
    </div>
  );
};

export default HomePage;
