import React from 'react';

// New Icons relevant to the updated content
const ChipIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5m3.75-15H21m-3.75 0h1.5m-1.5 0V3m0 3.75v1.5m0-1.5h-1.5m1.5 0h-1.5m-1.5 15H21m-3.75 0h1.5m-1.5 0v-1.5m0 1.5v-1.5m0 0h-1.5m1.5 0h-1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a3.75 3.75 0 00-3.75 3.75v.563c0 .351.042.698.125 1.031a3.75 3.75 0 003.625 2.656h0a3.75 3.75 0 003.625-2.656c.083-.333.125-.68.125-1.031V8.25A3.75 3.75 0 0012 4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75a3.75 3.75 0 013.75-3.75h.563c.351 0 .698.042 1.031.125a3.75 3.75 0 012.656 3.625v0a3.75 3.75 0 01-2.656 3.625c-.333.083-.68.125-1.031.125H8.25a3.75 3.75 0 01-3.75-3.75zM15.75 12a3.75 3.75 0 013.75 3.75h.563c.351 0 .698.042 1.031-.125a3.75 3.75 0 012.656-3.625v0a3.75 3.75 0 01-2.656-3.625c-.333-.083-.68.125-1.031-.125H19.5a3.75 3.75 0 01-3.75 3.75z" />
    </svg>
);

const ChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-2.25M21 12l-3.75 2.25" />
    </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const BuildingOfficeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 6.75h.008v.008H6.75V6.75zm.008 4.5h-.008v.008h.008v-.008zm0 4.5h-.008v.008h.008v-.008zm-2.25-4.5h.008v.008H4.5v-.008zm0 4.5h.008v.008H4.5v-.008zm12-4.5h.008v.008h-.008v-.008zm0 4.5h.008v.008h-.008v-.008z" />
    </svg>
);

const AcademicCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path d="M12 14.25c-3.1 0-6 1.65-6 3.75v.25h12v-.25c0-2.1-2.9-3.75-6-3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-3.1 0-6 1.65-6 3.75v.25h12v-.25c0-2.1-2.9-3.75-6-3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75c0-1.12.93-2.028 2.07-2.028h12.36c1.14 0 2.07.908 2.07 2.028v5.506A4.47 4.47 0 0112 14.25a4.47 4.47 0 01-8.25-2.018V6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25L12 4.722" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75L12 7.688 8.25 9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25v2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.5l-3.75-1.5-3.75 1.5" />
    </svg>
);

const reasons = [
  {
    icon: <ChipIcon className="h-10 w-10 mx-auto text-gold" />,
    title: '$70-90B AI & Energy Wave',
    quote: 'This investment is set to transform former industrial sites into "massive, multi-billion dollar data processing center[s]," creating thousands of high-paying tech jobs, which will dramatically increase demand for housing and commercial space.',
  },
  {
    icon: <ChartIcon className="h-10 w-10 mx-auto text-gold" />,
    title: 'Undervalued & Growing Market',
    quote: 'The market has historically avoided "the extreme highs and lows of larger real estate markets" and maintains a relatively low entry point. Prices are "projected to increase by about 3-5%" in the short-term, signaling the rapid appreciation phase is starting.',
  },
  {
    icon: <ShieldCheckIcon className="h-10 w-10 mx-auto text-gold" />,
    title: 'Strategic National Security Hub',
    quote: 'The region is positioned as a secure destination, being "well-protected from natural disasters." Local companies are actively involved in projects that strengthen national security and energy supply chains, ensuring continuous investment from federal-level stakeholders.',
  },
  {
    icon: <BuildingOfficeIcon className="h-10 w-10 mx-auto text-gold" />,
    title: 'Major Infrastructure Upgrades',
    quote: 'Key developments completing in 2025 include the "$1.4 billion Pittsburgh International Airport Modernization Program" and the build-out of the "178-acre Hazelwood Green Initiative" tech hub, significantly increasing the value of nearby properties.',
  },
  {
    icon: <AcademicCapIcon className="h-10 w-10 mx-auto text-gold" />,
    title: 'In-Place Tech Talent Pipeline',
    quote: 'As a major education center, the region generates over "4,500+ Annual grads in tech-related fields." This established talent pool is the foundation for the AI sector\'s expansion, guaranteeing stable rental and purchase demand from high-earning professionals.',
  }
];

export const InvestmentReasons: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal">Why Pittsburgh? Your Data-Driven Investment Briefing</h2>
           <p className="text-center text-charcoal-light max-w-3xl mx-auto mt-4 text-lg">
            The data is clear. A convergence of massive investment, undervalued assets, and strategic importance is creating a once-in-a-generation opportunity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col h-full border-t-4 border-gold">
              <div className="mb-4 flex-shrink-0">{reason.icon}</div>
              <h3 className="text-xl font-bold text-charcoal mb-3 flex-shrink-0 font-serif">{reason.title}</h3>
              <div className="flex-grow">
                <blockquote className="text-sm text-charcoal-light italic border-l-2 border-gray-200 pl-3 text-left">
                  {reason.quote}
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};