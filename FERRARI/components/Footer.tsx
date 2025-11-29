import React, { useState } from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon } from '../constants';

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
    <footer id="contact" className="bg-primary text-white py-20">
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
              <p className="text-gray-300"><span className="font-semibold">Direct:</span> <a href="tel:412-555-0199" className="hover:text-cream">(412) 555-0199</a></p>
              <p className="text-gray-300"><span className="font-semibold">Email:</span> <a href="mailto:nicole.severson@exprealty.com" className="hover:text-cream">nicole.severson@exprealty.com</a></p>
            </div>
            <div className="mb-8 border-t border-white/20 pt-6">
                <p className="text-2xl font-bold text-white">eXp</p>
                <p className="text-2xl font-bold text-white">Pittsburgh, PA</p>
            </div>

            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors"><FacebookIcon className="h-6 w-6 fill-current"/></a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors"><InstagramIcon className="h-6 w-6 fill-current"/></a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors"><TwitterIcon className="h-6 w-6 fill-current"/></a>
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
          <p>Nicole Marie Severson is a Licensed Real Estate Salesperson with eXp Realty in Pittsburgh, PA.</p>
          <p>&copy; {new Date().getFullYear()} eXp Realty, LLC. Each office is independently owned and operated. Equal Housing Opportunity.</p>
          <p className="space-x-4">
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
            <a href="/terms" className="underline hover:text-white">Terms of Use</a>
            <a href="/nms-admin" className="underline hover:text-white">NMS</a>
          </p>
        </div>
      </div>
    </footer>
  );
};