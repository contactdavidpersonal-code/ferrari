
import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://picsum.photos/seed/realtor/600/600" 
              alt="Realtor Jane Doe" 
              className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your Strategic Partner in Pittsburgh Real Estate</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              With deep roots in Pittsburgh and a finger on the pulse of the tech and investment sectors, I offer more than just brokerage services—I provide strategic counsel. My expertise lies in identifying high-yield commercial properties and guiding investors through the complexities of this booming market.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              For our nation's veterans, I am a dedicated advocate, specializing in the VA loan process to ensure you maximize your benefits and secure a home you deserve. My mission is to empower every client with the knowledge and opportunities to build lasting wealth and a fulfilling life in the Steel City.
            </p>
            <a href="#contact" className="bg-gray-800 text-white py-3 px-8 rounded-md hover:bg-gray-900 transition-colors duration-300">
              Plan Your Next Move
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};