import React from 'react';

const DMCA: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Digital Millennium Copyright Act (DMCA) Policy</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <p>
          Nicole Marie Severson and eXp Realty respect the intellectual property rights of others and expect users of this
          website to do the same. In compliance with the Digital Millennium Copyright Act (17 U.S.C. §512), we have adopted
          the policy outlined below for reporting alleged copyright infringement.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">1. Submitting a DMCA Notice</h2>
        <p>
          If you believe that content hosted on this website infringes your copyright, please send a written notification
          that includes all items listed below. We may remove or disable the content if the notice is complete and valid.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your full legal name, mailing address, telephone number, and email address</li>
          <li>
            Identification of the copyrighted work claimed to have been infringed, or a representative list if multiple
            works are covered by a single notification
          </li>
          <li>
            Identification of the material claimed to be infringing and information reasonably sufficient to locate it
            (URL, screenshots, MLS number, etc.)
          </li>
          <li>A statement that you have a good faith belief the disputed use is not authorized by the copyright owner</li>
          <li>
            A statement, under penalty of perjury, that the information in the notification is accurate and that you are
            the copyright owner or are authorized to act on the owner&apos;s behalf
          </li>
          <li>Your physical or electronic signature</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal">2. DMCA Agent</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Designated DMCA Agent</p>
          <p>Nicole Marie Severson, Realtor®</p>
          <p>c/o eXp Realty</p>
          <p>6425 Living Pl #200</p>
          <p>Pittsburgh, PA 15206</p>
          <p>Email: <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a></p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">3. Counter-Notification</h2>
        <p>
          If your content was removed due to a DMCA notice and you believe the removal was improper, you may submit a
          written counter-notification that complies with 17 U.S.C. §512(g). We will forward the counter-notification to
          the original complainant and restore the content within ten (10) business days unless the complainant informs us
          that they have filed a court action seeking to prevent further infringement.
        </p>

        <h2 className="text-2xl font-bold text-charcoal">4. Repeat Infringer Policy</h2>
        <p>
          Accounts, users, or vendors who repeatedly infringe intellectual property rights may have access terminated or
          be barred from future participation on this site.
        </p>
      </div>
    </div>
  </section>
);

export default DMCA;

