import React from 'react';

const FairHousing: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Fair Housing & Equal Opportunity Statement</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="font-semibold text-emerald-900">
            Nicole Marie Severson and eXp Realty, LLC are proud to market and sell real estate in accordance with the
            Fair Housing Act, Equal Credit Opportunity Act, Pennsylvania Human Relations Act, and related federal, state,
            and local fair housing laws.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">Protected Classes</h2>
        <p>
          We will not discriminate against any person based on race, color, religion, sex (including sexual orientation,
          gender identity, and pregnancy), national origin, disability, familial status, ancestry, age, veteran status, or
          any other protected characteristic under applicable law.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">Our Commitments</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide equal professional service to every prospective client or customer.</li>
          <li>Advertise housing only to the general public and not limit availability to any person or group.</li>
          <li>Show properties and submit offers without regard to protected characteristics.</li>
          <li>Refuse to participate in steering, blockbusting, redlining, or discrimination in lending.</li>
          <li>Make reasonable accommodations for individuals with disabilities.</li>
          <li>Display the Equal Housing Opportunity logo on marketing materials and this website.</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">Filing a Complaint</h2>
        <p>
          If you believe you have experienced housing discrimination, you may file a complaint with the U.S. Department of
          Housing and Urban Development (HUD) or the Pennsylvania Human Relations Commission (PHRC).
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>HUD:</strong>{' '}
            <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              hud.gov/fairhousing
            </a>{' '}
            | Phone: 1-800-669-9777 | TTY: 1-800-927-9275
          </li>
          <li>
            <strong>PHRC:</strong> 333 Market Street, 8th Floor, Harrisburg, PA 17101 | Phone: 717-787-4410
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">Questions & Reporting</h2>
        <p>
          Please contact Nicole at <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a>{' '}
          or (510) 313-3291 if you believe any part of your experience (online or offline) may not align with fair housing
          standards. Reports are investigated promptly and corrective steps are taken where necessary.
        </p>
      </div>
    </div>
  </section>
);

export default FairHousing;

