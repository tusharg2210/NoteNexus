import React, { useEffect } from 'react';
import HeroSection from '../Components/HeroSection';
import AboutSection from '../Pages/AboutUs';
import FeaturesSection from '../Components/Features';
import TeamSection from '../Components/Team';

function HomePage() {
   
   return (
      <>
      <div>
         <HeroSection />
         <AboutSection />
         <FeaturesSection />
         <TeamSection />
      </div>
      
   </>
);
}
export default HomePage;