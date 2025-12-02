import React, { useState } from 'react';
import { FacebookIcon, InstagramIcon } from '../constants';

export const Footer: React.FC = () => {
  const news = [
    {
      title: 'AI and Energy Investments Accelerate Pittsburgh Growth',
      source: 'Pittsburgh Living',
      url: 'https://pghliving.com/pa-ai-investment/',
      summary: 'Billions in AI and energy infrastructure spending signal long-term economic expansion across the region.'
    },
    {
      title: 'PA SITES Initiative Funds Pad-Ready Development',
      source: 'Pittsburgh Region',
      url: 'https://pittsburghregion.org/the-region/',
      summary: 'State-backed site preparation unlocks new industrial and commercial projects around Pittsburgh.'
    },
    {
      title: 'Industrial Park Expansion Highlights Demand',
      source: 'CRE Page',
      url: 'https://crepage.com/city/pittsburgh/',
      summary: 'Major acquisitions and upgrades show strong appetite for logistics, research, and light manufacturing space.'
    }
  ];

  return (
    <footer
      id="contact"
      className="bg-primary text-white py-20"
      style={{
        clipPath: 'polygon(4% 0%, 96% 0%, 100% 6%, 100% 100%, 0% 100%, 0% 6%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info & Socials */}
          <div>
            <h3 className="text-3xl font-serif font-bold mb-4">Ask for Nicole Severson!</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              This is a defining moment for you and/or your business. Pittsburgh's real estate future is unfolding right now, and every decision counts. Call me today and we can dicuss the best property opportunities for your future.
            </p>
            
            {/* Agent & Brokerage Info */}
            <div className="space-y-3 mb-8">
              <p className="text-lg font-semibold text-white">Nicole Marie Severson</p>
              <p className="text-gray-300"><span className="font-semibold">Direct:</span> <a href="tel:510-313-3291" className="hover:text-cream">(510) 313-3291</a></p>
              <p className="text-gray-300"><span className="font-semibold">Email:</span> <a href="mailto:nicole@exppgh.com" className="hover:text-cream">nicole@exppgh.com</a></p>
            </div>
            <div className="mb-8 border-t border-white/20 pt-6">
                <p className="text-2xl font-bold text-white">eXp</p>
                <p className="text-2xl font-bold text-white">Pittsburgh, PA</p>
            </div>

            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors"><FacebookIcon className="h-6 w-6 fill-current"/></a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors"><InstagramIcon className="h-6 w-6 fill-current"/></a>
            </div>
          </div>
          
          {/* Pittsburgh Latest News */}
          <div>
            <h3 className="text-3xl font-serif font-bold mb-4">Secure your new property before its gone!</h3>
            <ul className="space-y-4">
              {news.map((n, idx) => (
                <li key={idx} className="bg-white/10 border border-white/20 rounded-md p-4">
                  <p className="text-white font-semibold">{n.title}</p>
                  <p className="text-gray-200 text-sm mt-1">{n.summary}</p>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline text-cream hover:text-white">
                    Source: {n.source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-6 text-center text-gray-300 text-sm space-y-2">
          <p>Nicole Marie Severson is a Licensed Realtor® with eXp Realty in Pittsburgh, PA (West Penn MLS).</p>
          <p>
            &copy; {new Date().getFullYear()} eXp Realty, LLC. Each office is independently owned and operated. Equal Housing
            Opportunity • <a href="/fair-housing" className="underline hover:text-white">Fair Housing Statement</a>.
          </p>
          <p className="text-xs text-gray-400">
            ADA / WCAG Support:{' '}
            <a href="mailto:nicole@exppgh.com" className="underline hover:text-white">nicole@exppgh.com</a> • (510) 313-3291
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:text-sm">
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
            <a href="/terms" className="underline hover:text-white">Terms of Use</a>
            <a href="/cookies" className="underline hover:text-white">Cookie Policy</a>
            <a href="/accessibility" className="underline hover:text-white">Accessibility</a>
            <a href="/dmca" className="underline hover:text-white">DMCA</a>
            <a href="/privacy#do-not-sell" className="underline hover:text-white">Do Not Sell My Info</a>
            <a href="https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/RealEstateCommission/Documents/Consumer-Notice-Residential.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              PA Consumer Notice
            </a>
            <a href="/nms-admin" className="underline hover:text-white">NMS</a>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-cookie-preferences'));
              }
            }}
            className="text-xs underline hover:text-white"
          >
            Cookie Preferences
          </button>
        </div>
      </div>
    </footer>
  );
};