import React from 'react';

export const Terms: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Terms of Use</h1>
      <p className="text-charcoal-light mb-8">Effective Date: {new Date().getFullYear()}-01-01</p>

      <div className="prose prose-lg max-w-none space-y-4">
        <p>
          These Terms of Use govern your access to and use of this website and Nicole's Assistant (the "Site").
          By using the Site, you agree to these Terms and to our Privacy Policy.
        </p>

        <h2>Licensed Services & Disclosures</h2>
        <p>
          Real estate services are provided by a licensed salesperson affiliated with Berkshire Hathaway HomeServices
          The Preferred Realty in Pittsburgh, Pennsylvania. Advertising complies with Pennsylvania Real Estate Commission
          regulations, including display of the brokerage name and main office telephone number.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          The Site and Nicole's Assistant provide general information only. They do not provide legal, tax, financial,
          or investment advice, and do not perform licensed real estate activities. You should consult your own
          attorney, tax advisor, or financial professional for advice specific to your situation.
        </p>

        <h2>AI Assistant Disclosure</h2>
        <p>
          You are communicating with an AI assistant. Use of the assistant does not create an agency, fiduciary,
          or attorney-client relationship. Substantive questions will be referred to the supervising licensed agent.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on the Site is owned by the respective rights holders and protected by U.S. law. You
          may not copy, distribute, or create derivative works without permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, the Site, the assistant developer, the agent, and the brokerage
          are not liable for direct, indirect, incidental, special, or consequential damages arising from your use
          of or reliance on the Site or Nicole's Assistant.
        </p>

        <h2>Changes & Contact</h2>
        <p>
          We may update these Terms from time to time. Continued use constitutes acceptance of the updated terms.
          Questions: Berkshire Hathaway HomeServices The Preferred Realty — Main Office: 412-365-0333.
        </p>
      </div>
    </div>
  </section>
);

export default Terms;

