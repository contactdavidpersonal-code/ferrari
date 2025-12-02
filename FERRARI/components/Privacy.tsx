import React from 'react';

export const Privacy: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Privacy Policy</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="font-semibold text-amber-800">
            IMPORTANT: By using this website, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy, 
            our Terms of Use, and the terms applicable to eXp Realty, LLC and its affiliated vendors. Your continued use of this site 
            constitutes your acceptance of these terms.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">1. Introduction and Scope</h2>
        <p>
          This Privacy Policy ("Policy") governs the collection, use, disclosure, and protection of personal information 
          by Nicole Marie Severson ("Agent," "we," "us," or "our"), a licensed Realtor® affiliated with eXp Realty, LLC 
          ("Brokerage"), in connection with this website (the "Site") and all related real estate services provided in 
          Pittsburgh, Pennsylvania and surrounding areas.
        </p>
        <p>
          This Policy applies to all visitors, users, and clients ("you" or "User") who access or use the Site, communicate 
          with the Agent or Nicole's Assistant (our AI-powered chat tool), or engage in any real estate transaction facilitated 
          through the Agent. We comply with the Pennsylvania Real Estate Licensing and Registration Act (RELRA), applicable 
          U.S. federal and state privacy laws, and real estate industry regulations.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">2. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold text-charcoal mt-4">2.1 Information You Provide Directly</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address</li>
          <li><strong>Communication Preferences:</strong> Preferred method of contact (email, phone, text message)</li>
          <li><strong>Real Estate Inquiry Data:</strong> Property interests, buying/selling timeline, budget range, neighborhood preferences, property type preferences</li>
          <li><strong>Transaction Information:</strong> Buying stage, appointment preferences, consultation requests</li>
          <li><strong>Digital Signatures:</strong> Electronic signatures on listing agreements, buyer representation agreements, and other real estate documents</li>
          <li><strong>AI Chat Conversations:</strong> All messages, inquiries, and information shared through Nicole's Assistant</li>
          <li><strong>Financial Information:</strong> Pre-approval status, budget considerations (as voluntarily disclosed)</li>
        </ul>

        <h3 className="text-xl font-semibold text-charcoal mt-4">2.2 Information Collected Automatically</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on Site, click patterns, property listings viewed</li>
          <li><strong>Location Data:</strong> General geographic location based on IP address</li>
          <li><strong>Referral Information:</strong> How you arrived at the Site (search engine, social media, direct link)</li>
          <li><strong>Cookies and Tracking Technologies:</strong> Session cookies, persistent cookies, web beacons, and similar technologies</li>
        </ul>
        <p className="text-sm text-charcoal-light">
          Manage your preferences anytime via the on-site cookie banner or by visiting the{' '}
          <a href="/cookies" className="text-primary underline">Cookie Policy</a>. We honor Global Privacy Control (GPC) signals where supported.
        </p>

        <h3 className="text-xl font-semibold text-charcoal mt-4">2.3 Information from Third Parties</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Public records and MLS (Multiple Listing Service) data</li>
          <li>Credit and background check information (with your consent, for transaction purposes)</li>
          <li>Information from referral sources and other real estate professionals</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">3. Nicole's Assistant (AI) – Specific Disclosures</h2>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="font-semibold text-blue-800 mb-2">AI DISCLOSURE NOTICE</p>
          <p>
            Nicole's Assistant is an artificial intelligence-powered chat tool. When you interact with Nicole's Assistant:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Your conversations may be processed by third-party AI services (Google Gemini) to generate responses</li>
            <li>Conversation history is stored in our database for lead management and follow-up purposes</li>
            <li>Phone numbers and contact information captured during chat are automatically saved as leads</li>
            <li>The AI is NOT a licensed real estate professional and cannot provide legal, tax, financial, or specific property valuation advice</li>
            <li>Information provided by the AI may be incomplete, inaccurate, or outdated</li>
            <li>All substantive inquiries will be referred to the licensed Agent for professional guidance</li>
            <li>Use of Nicole's Assistant does not create an agency, fiduciary, or attorney-client relationship</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">4. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To respond to inquiries and provide requested real estate services</li>
          <li>To schedule property showings, consultations, and appointments</li>
          <li>To send property listings, market updates, and promotional materials (with your consent)</li>
          <li>To facilitate real estate transactions, including coordination with third-party vendors</li>
          <li>To maintain lead records and track communication history</li>
          <li>To improve the Site, AI assistant functionality, and our services</li>
          <li>To comply with legal obligations and regulatory requirements</li>
          <li>To prevent fraud, protect security, and enforce our terms</li>
          <li>To send email notifications about your inquiries (via Resend email service)</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">5. Sharing and Disclosure of Information</h2>
        <p className="font-semibold">We may share your personal information with the following parties:</p>
        
        <h3 className="text-xl font-semibold text-charcoal mt-4">5.1 eXp Realty, LLC and Affiliates</h3>
        <p>
          As a licensed Realtor affiliated with eXp Realty, LLC, your information may be shared with the Brokerage and its 
          affiliates for transaction support, compliance, training, quality assurance, and other legitimate business purposes. 
          By using this Site, you consent to such sharing and agree to be bound by eXp Realty's privacy practices.
        </p>

        <h3 className="text-xl font-semibold text-charcoal mt-4">5.2 Real Estate Transaction Vendors</h3>
        <p>
          To facilitate your real estate transaction, we may share your information with third-party service providers, including but not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Title companies and escrow agents</li>
          <li>Mortgage lenders and loan officers</li>
          <li>Home inspectors and appraisers</li>
          <li>Home warranty companies</li>
          <li>Insurance agents and providers</li>
          <li>Attorneys and legal professionals</li>
          <li>Contractors, repair specialists, and home service providers</li>
          <li>Moving companies</li>
          <li>Other real estate agents and brokerages (for co-brokered transactions)</li>
        </ul>
        <p className="mt-2">
          <strong>By engaging in a real estate transaction through the Agent, you expressly consent to the sharing of your 
          information with all vendors reasonably necessary to complete the transaction, including pre-sale, during-sale, 
          and post-sale services.</strong>
        </p>

        <h3 className="text-xl font-semibold text-charcoal mt-4">5.3 Technology and Service Providers</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Neon / Supabase:</strong> Primary database hosting, authentication, and storage for leads</li>
          <li><strong>Resend:</strong> Transactional email delivery (lead notifications and confirmations)</li>
          <li><strong>Google (Gemini AI):</strong> Processing of chat prompts to generate draft responses</li>
          <li><strong>Vercel & Firebase Hosting:</strong> Frontend hosting, CDN, and deployment telemetry</li>
          <li><strong>Google Analytics / Vercel Analytics:</strong> First-party analytics to measure site performance</li>
          <li><strong>Calendly / Scheduling tools (if used):</strong> Appointment management</li>
          <li><strong>Secure file-sharing or e-sign vendors (e.g., Docusign) when needed for transactions</strong></li>
        </ul>
        <p className="text-sm text-charcoal-light">
          Each vendor processes data under a written agreement that requires confidentiality, security, and compliance with
          applicable privacy laws.
        </p>

        <h3 className="text-xl font-semibold text-charcoal mt-4">5.4 Legal and Regulatory Disclosure</h3>
        <p>
          We may disclose your information when required by law, subpoena, court order, or government request, or when 
          necessary to protect our rights, safety, or property, or the rights, safety, or property of others.
        </p>

        <h3 className="text-xl font-semibold text-charcoal mt-4">5.5 No Sale of Personal Information</h3>
        <p>
          We do not sell your personal information to third parties for their direct marketing purposes.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">6. Consent to Electronic Communications</h2>
        <p>
          When you submit a form, chat with Nicole&apos;s Assistant, or otherwise provide contact details, you consent to receive
          communications via the channel(s) you select (email, phone call, SMS/text). Consent is captured through explicit
          checkboxes on our lead forms and may be withdrawn at any time.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Responses to your inquiries and property recommendations</li>
          <li>Transaction updates, disclosures, signatures, and compliance notices</li>
          <li>Market reports, newsletters, and promotional material (only if you opt in)</li>
          <li>Automated reminders related to showings or appointments</li>
        </ul>
        <p className="mt-2 text-sm">
          To revoke consent for marketing emails, use the unsubscribe link or email{' '}
          <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a>. To revoke SMS consent,
          reply STOP to any text message or call (510) 313-3291. Standard message and data rates may apply. Transactional and
          legally required communications may continue while an active representation agreement is in place.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes described in this Policy, 
          including to comply with legal obligations, resolve disputes, and enforce our agreements. Lead information and 
          transaction records may be retained for a minimum of seven (7) years in accordance with real estate industry 
          standards and legal requirements.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">8. Data Security</h2>
        <p>
          We implement reasonable administrative, technical, and physical safeguards to protect your personal information 
          against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
          Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">9. Your Rights and Choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal retention requirements</li>
          <li><strong>Opt-Out:</strong> Opt out of marketing communications</li>
          <li><strong>Do Not Track:</strong> We do not currently respond to "Do Not Track" browser signals</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, contact us at the information provided below. We may require verification of your identity 
          before processing your request.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">10. Limitation of Liability and Release</h2>
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="font-bold text-red-800 mb-2">IMPORTANT LIABILITY NOTICE</p>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              THE AGENT, BROKERAGE (eXp REALTY, LLC), AND ALL AFFILIATED VENDORS SHALL NOT BE LIABLE FOR ANY DIRECT, 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SITE, 
              RELIANCE ON INFORMATION PROVIDED BY NICOLE'S ASSISTANT, OR ANY REAL ESTATE TRANSACTION.
            </li>
            <li>
              BY USING THIS SITE, YOU RELEASE AND HOLD HARMLESS THE AGENT, eXp REALTY, LLC, AND ALL AFFILIATED VENDORS 
              FROM ANY CLAIMS, DAMAGES, LOSSES, OR LIABILITIES ARISING FROM OR RELATED TO YOUR USE OF THE SITE, THE AI 
              ASSISTANT, OR ANY REAL ESTATE SERVICES PROVIDED.
            </li>
            <li>
              YOU ACKNOWLEDGE THAT REAL ESTATE TRANSACTIONS INVOLVE INHERENT RISKS AND THAT YOU ARE RESPONSIBLE FOR 
              CONDUCTING YOUR OWN DUE DILIGENCE AND SEEKING INDEPENDENT PROFESSIONAL ADVICE.
            </li>
            <li>
              THE AGENT AND BROKERAGE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, COMPLETENESS, 
              OR RELIABILITY OF ANY INFORMATION ON THE SITE OR PROVIDED THROUGH NICOLE'S ASSISTANT.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">11. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless the Agent, eXp Realty, LLC, and their officers, directors, 
          employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses 
          (including reasonable attorneys' fees) arising from or related to your use of the Site, violation of this Policy, 
          or infringement of any third-party rights.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">12. Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites. We are not responsible for the privacy practices or content 
          of such websites. We encourage you to review the privacy policies of any third-party sites you visit.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">13. Children's Privacy</h2>
        <p>
          The Site is not intended for individuals under 18 years of age. We do not knowingly collect personal information 
          from children. If you believe we have collected information from a child, please contact us immediately.
        </p>

        <h2 id="do-not-sell" className="text-2xl font-bold text-charcoal mt-8">14. California & CCPA Privacy Rights</h2>
        <p>
          If you are a California resident, you have the rights described below under the California Consumer Privacy Act
          (CCPA) and related regulations. We honor these rights for all U.S. residents where practical.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Know/Access:</strong> Request disclosure of the categories and specific pieces of personal information we collected.</li>
          <li><strong>Delete:</strong> Request deletion of personal information, subject to legal retention requirements.</li>
          <li><strong>Correct:</strong> Request correction of inaccurate information.</li>
          <li><strong>Opt-Out of Sale/Sharing:</strong> Direct us not to “sell” or “share” personal information for cross-context behavioral advertising.</li>
          <li><strong>Limit Use of Sensitive Data:</strong> Direct us to use sensitive personal information only for necessary business purposes.</li>
          <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
        </ul>
        <p>
          To submit a request, email <a href="mailto:nicole@exppgh.com" className="text-primary underline">nicole@exppgh.com</a> or call (510) 313-3291. Please include your full name, contact information, the right you are invoking, and proof of identity. We will respond within 45 days (with the option to extend an additional 45 days where permitted).
        </p>
        <p className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <strong>Do Not Sell / Share My Personal Information:</strong> Submit your request via email or phone using the contact information above. If your browser supports it, we also honor Global Privacy Control (GPC) signals by disabling non-essential cookies and marketing tags automatically.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">15. Changes to This Policy</h2>
        <p>
          We reserve the right to modify this Policy at any time. Changes will be effective upon posting to the Site. 
          Your continued use of the Site after any changes constitutes acceptance of the updated Policy. We encourage 
          you to review this Policy periodically.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">16. Governing Law</h2>
        <p>
          This Policy shall be governed by and construed in accordance with the laws of the Commonwealth of Pennsylvania, 
          without regard to conflict of law principles. Any disputes arising under this Policy shall be resolved in the 
          state or federal courts located in Allegheny County, Pennsylvania.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">17. Contact Information</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Nicole Marie Severson, Realtor®</p>
          <p>eXp Realty, LLC</p>
          <p>Pittsburgh, Pennsylvania</p>
          <p>Phone: <a href="tel:510-313-3291" className="text-primary hover:underline">(510) 313-3291</a></p>
          <p>Email: <a href="mailto:nicole@exppgh.com" className="text-primary hover:underline">nicole@exppgh.com</a></p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">18. Acceptance of Terms</h2>
        <div className="bg-charcoal text-white p-6 rounded-lg mt-4">
          <p className="font-bold mb-2">BY USING THIS WEBSITE, YOU ACKNOWLEDGE AND AGREE THAT:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have read and understood this Privacy Policy in its entirety</li>
            <li>You consent to the collection, use, and disclosure of your information as described herein</li>
            <li>You accept the limitation of liability and release provisions set forth above</li>
            <li>You agree to be bound by the privacy practices of eXp Realty, LLC and affiliated vendors</li>
            <li>You understand that Nicole's Assistant is an AI tool and not a licensed real estate professional</li>
            <li>You consent to receive electronic communications as described in this Policy</li>
          </ul>
          <p className="mt-4 text-sm">
            If you do not agree to these terms, please do not use this website or provide any personal information.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Privacy;
