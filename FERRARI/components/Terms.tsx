import React from 'react';

export const Terms: React.FC = () => (
  <section className="pt-32 pb-20 bg-white">
    <div className="container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6">Terms of Use</h1>
      <p className="text-charcoal-light mb-4">Effective Date: {new Date().getFullYear()}-01-01</p>
      <p className="text-charcoal-light mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="font-semibold text-amber-800">
            IMPORTANT: PLEASE READ THESE TERMS CAREFULLY. BY ACCESSING OR USING THIS WEBSITE, YOU AGREE TO BE BOUND BY 
            THESE TERMS OF USE, OUR PRIVACY POLICY, AND THE TERMS OF eXp REALTY, LLC AND ITS AFFILIATED VENDORS. IF YOU 
            DO NOT AGREE TO THESE TERMS, DO NOT USE THIS WEBSITE.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">1. Acceptance of Terms</h2>
        <p>
          These Terms of Use ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and 
          Nicole Marie Severson ("Agent," "we," "us," or "our"), a licensed Realtor® affiliated with eXp Realty, LLC 
          ("Brokerage"), governing your access to and use of this website (the "Site"), including Nicole's Assistant 
          (our AI-powered chat tool) and all related services.
        </p>
        <p>
          By accessing, browsing, or using the Site, you acknowledge that you have read, understood, and agree to be bound 
          by these Terms and our Privacy Policy, which is incorporated herein by reference. Your continued use of the Site 
          constitutes ongoing acceptance of these Terms as they may be modified from time to time.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">2. Real Estate Licensing Disclosures</h2>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="font-semibold text-blue-800 mb-2">PENNSYLVANIA REAL ESTATE DISCLOSURE</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nicole Marie Severson is a licensed Realtor® in the Commonwealth of Pennsylvania</li>
            <li>Agent is affiliated with eXp Realty, LLC, a licensed real estate brokerage</li>
            <li>All real estate services are provided in compliance with the Pennsylvania Real Estate Licensing and Registration Act (RELRA)</li>
            <li>Advertising on this Site complies with Pennsylvania Real Estate Commission regulations</li>
            <li>The Agent's license is subject to the rules and regulations of the Pennsylvania Real Estate Commission</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">3. eXp Realty Affiliation and Vendor Relationships</h2>
        <p>
          By using this Site or engaging in any real estate transaction with the Agent, you acknowledge and agree that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The Agent operates under the supervision and policies of eXp Realty, LLC</li>
          <li>eXp Realty, LLC's terms, policies, and procedures apply to all transactions</li>
          <li>You consent to the involvement of eXp Realty's affiliated vendors in your transaction</li>
          <li>Third-party vendors (title companies, lenders, inspectors, etc.) are independent contractors, and the Agent and Brokerage are not responsible for their services</li>
          <li>You agree to be bound by the terms and conditions of any vendor you engage through this transaction</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">4. Brokerage Relationships & Agency Disclosure</h2>
        <p>
          Pennsylvania law requires us to disclose the nature of our brokerage relationship. By engaging with this Site or
          Nicole, you acknowledge that you have received or can access the{' '}
          <a href="https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/RealEstateCommission/Documents/Consumer-Notice-Residential.pdf" target="_blank" rel="noopener noreferrer" className="underline text-primary">
            Pennsylvania Consumer Notice
          </a>.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Seller Agency / Landlord Agency:</strong> We represent the seller/landlord and owe fiduciary duties to the
            property owner. Buyers/tenants should not disclose confidential information unless buyer agency is established.
          </li>
          <li>
            <strong>Buyer Agency / Tenant Agency:</strong> When a written buyer agency agreement is executed, we owe undivided
            loyalty, confidentiality, and advocacy to the buyer/tenant.
          </li>
          <li>
            <strong>Dual Agency / Designated Agency:</strong> Dual representation may occur only with informed written consent
            from all parties. In such cases, our duties are limited to fairness and disclosure of material facts; we cannot
            advocate for one party over the other.
          </li>
          <li>
            <strong>Transaction Licensee:</strong> In limited circumstances, we may act as a transaction licensee providing
            neutral assistance without representing either party.
          </li>
        </ul>
        <p>
          No agency relationship is created simply by viewing this Site or interacting with Nicole's Assistant. Agency is
          formed only through a signed written agreement that meets Pennsylvania law.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">5. Nicole's Assistant (AI) Terms</h2>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="font-semibold text-yellow-800 mb-2">AI ASSISTANT DISCLOSURE AND LIMITATIONS</p>
          <p className="mb-2">
            Nicole's Assistant is an artificial intelligence-powered chat tool designed to provide general information 
            about properties and real estate. BY USING NICOLE'S ASSISTANT, YOU ACKNOWLEDGE AND AGREE:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Not a Licensed Professional:</strong> Nicole's Assistant is NOT a licensed real estate professional, 
              attorney, accountant, financial advisor, or any other licensed professional
            </li>
            <li>
              <strong>No Professional Advice:</strong> The AI cannot and does not provide legal, tax, financial, investment, 
              property valuation, or other professional advice
            </li>
            <li>
              <strong>Information Accuracy:</strong> Information provided by the AI may be incomplete, inaccurate, outdated, 
              or incorrect. You should independently verify all information
            </li>
            <li>
              <strong>No Agency Relationship:</strong> Use of Nicole's Assistant does not create an agency, fiduciary, 
              brokerage, or attorney-client relationship
            </li>
            <li>
              <strong>Data Collection:</strong> Your conversations are recorded, stored, and may be used for lead management, 
              training, and service improvement
            </li>
            <li>
              <strong>Third-Party Processing:</strong> Conversations may be processed by third-party AI services (Google Gemini)
            </li>
            <li>
              <strong>Referral to Agent:</strong> Substantive questions requiring professional expertise will be referred to 
              the licensed Agent
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">6. Fair Housing & Equal Opportunity</h2>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="font-semibold text-emerald-900 mb-2">
            We market, show, and sell property in strict compliance with the federal Fair Housing Act, Equal Credit
            Opportunity Act, Pennsylvania Human Relations Act, and applicable local ordinances.
          </p>
          <p>
            We do not discriminate against any person based on race, color, religion, sex (including sexual orientation,
            gender identity, and pregnancy), national origin, disability, familial status, age, ancestry, veteran status, or
            any other characteristic protected by law. We refuse steering, blockbusting, redlining, or discriminatory
            advertising.
          </p>
          <p className="mt-2">
            Equal Housing Opportunity complaints may be submitted to the U.S. Department of Housing and Urban Development
            (1-800-669-9777) or the Pennsylvania Human Relations Commission (717-787-4410). Contact Nicole immediately if
            you believe any aspect of your experience conflicts with these obligations.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">7. No Professional Advice</h2>
        <p>
          The content on this Site, including but not limited to property listings, market information, and AI assistant 
          responses, is provided for general informational purposes only. Nothing on this Site constitutes:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Legal advice or legal representation</li>
          <li>Tax advice or tax planning services</li>
          <li>Financial advice or investment recommendations</li>
          <li>Property appraisal or valuation services</li>
          <li>Home inspection or structural assessment services</li>
          <li>Insurance advice or recommendations</li>
        </ul>
        <p className="mt-2">
          You are strongly encouraged to consult with qualified, licensed professionals (attorneys, accountants, 
          financial advisors, home inspectors, etc.) before making any real estate decisions.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">8. Property Listings, MLS Data, and Disclaimers</h2>
        <p>
          Property listings and related information on this Site are believed to be accurate but are not guaranteed.
          Information may come from the West Penn Multi-List (WPML), other Multiple Listing Services, public records,
          third-party data providers, or the Agent&apos;s own research. We comply with all MLS data licensing requirements.
          You acknowledge that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Listings are subject to prior sale, price changes, corrections, and withdrawal without notice</li>
          <li>Square footage, lot sizes, and other measurements are approximate and should be independently verified</li>
          <li>Photos, renderings, and videos may not reflect current property conditions</li>
          <li>School district, zoning, rent control, and tax information must be verified with the appropriate authorities</li>
          <li>
            MLS data is provided for consumers&apos; personal, non-commercial use and may not be used for any purpose other than
            to identify prospective properties consumers may be interested in purchasing
          </li>
          <li>Data is deemed reliable but not guaranteed; WPML and participating brokers are not responsible for accuracy</li>
        </ul>
        <p className="text-sm text-charcoal-light">
          Reproduction, redistribution, or retransmission of MLS data without the express written consent of the originating
          MLS is prohibited. Courtesy of West Penn Multi-List, Inc. &copy; {new Date().getFullYear()}. All rights reserved.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">9. User Conduct and Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
          <li>Provide false, misleading, or fraudulent information</li>
          <li>Attempt to gain unauthorized access to the Site or its systems</li>
          <li>Interfere with or disrupt the Site's operation</li>
          <li>Scrape, harvest, or collect information from the Site without permission</li>
          <li>Use automated systems or software to interact with Nicole's Assistant</li>
          <li>Harass, abuse, or harm the Agent, staff, or other users</li>
          <li>Infringe on any intellectual property rights</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">10. Intellectual Property</h2>
        <p>
          All content on the Site, including text, graphics, logos, images, photographs, videos, software, and compilation 
          of content, is the property of the Agent, eXp Realty, LLC, or their licensors and is protected by U.S. and 
          international copyright, trademark, and other intellectual property laws. You may not copy, reproduce, distribute, 
          modify, create derivative works from, publicly display, or otherwise use any content without prior written permission.
          See our <a href="/dmca" className="underline text-primary">DMCA Policy</a> for instructions on submitting copyright notices.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">11. Disclaimer of Warranties</h2>
        <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg">
          <p className="font-bold uppercase mb-2">
            THE SITE, INCLUDING ALL CONTENT, FEATURES, AND NICOLE'S ASSISTANT, IS PROVIDED "AS IS" AND "AS AVAILABLE" 
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </p>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, THE AGENT, eXp REALTY, LLC, AND THEIR AFFILIATES DISCLAIM ALL WARRANTIES, 
            INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
            <li>WARRANTIES OF TITLE AND NON-INFRINGEMENT</li>
            <li>WARRANTIES THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE</li>
            <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY INFORMATION</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">12. Limitation of Liability</h2>
        <div className="bg-red-50 border border-red-300 p-4 rounded-lg">
          <p className="font-bold text-red-800 uppercase mb-2">IMPORTANT LIABILITY LIMITATIONS</p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              IN NO EVENT SHALL THE AGENT, eXp REALTY, LLC, OR ANY AFFILIATED VENDORS, OFFICERS, DIRECTORS, EMPLOYEES, 
              AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY 
              DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE 
              LOSSES, ARISING FROM OR RELATED TO YOUR USE OF THE SITE OR ANY REAL ESTATE TRANSACTION.
            </li>
            <li>
              THE TOTAL LIABILITY OF THE AGENT AND BROKERAGE FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR 
              THE SITE SHALL NOT EXCEED THE GREATER OF (A) ONE HUNDRED DOLLARS ($100) OR (B) THE AMOUNT YOU PAID TO THE 
              AGENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </li>
            <li>
              THESE LIMITATIONS APPLY REGARDLESS OF THE LEGAL THEORY (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE) 
              AND EVEN IF THE AGENT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">13. Release and Waiver</h2>
        <div className="bg-red-50 border border-red-300 p-4 rounded-lg">
          <p className="font-bold text-red-800 mb-2">BY USING THIS SITE, YOU EXPRESSLY AGREE TO THE FOLLOWING RELEASE:</p>
          <p>
            You hereby RELEASE, WAIVE, DISCHARGE, AND COVENANT NOT TO SUE the Agent (Nicole Marie Severson), eXp Realty, LLC, 
            and all affiliated vendors, partners, officers, directors, employees, agents, successors, and assigns 
            (collectively, the "Released Parties") from any and all liability, claims, demands, actions, causes of action, 
            costs, expenses, and damages whatsoever, whether known or unknown, arising out of or related to:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Your use of the Site or Nicole's Assistant</li>
            <li>Any information provided on or through the Site</li>
            <li>Any real estate transaction facilitated through the Agent</li>
            <li>Services provided by any third-party vendor</li>
            <li>Any property condition, defect, or issue</li>
            <li>Any loss or damage to property or person</li>
          </ul>
          <p className="mt-2">
            This release extends to claims arising before, during, and after any real estate transaction, including 
            post-closing matters.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">14. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless the Agent, eXp Realty, LLC, and all affiliated vendors, 
          officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, 
          costs, liabilities, and expenses (including reasonable attorneys' fees and court costs) arising from or 
          related to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your use of the Site or Nicole's Assistant</li>
          <li>Your violation of these Terms or the Privacy Policy</li>
          <li>Your violation of any applicable law or regulation</li>
          <li>Your infringement of any third-party rights</li>
          <li>Any content or information you submit through the Site</li>
          <li>Any real estate transaction in which you participate</li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">15. Dispute Resolution and Arbitration</h2>
        <p>
          Any dispute, controversy, or claim arising out of or relating to these Terms, the Site, or any real estate 
          services shall be resolved as follows:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Informal Resolution:</strong> You agree to first attempt to resolve any dispute informally by 
            contacting the Agent within thirty (30) days of the dispute arising.
          </li>
          <li>
            <strong>Mediation:</strong> If informal resolution fails, the parties agree to mediate any dispute before 
            a mutually agreed mediator in Allegheny County, Pennsylvania.
          </li>
          <li>
            <strong>Binding Arbitration:</strong> If mediation fails, any remaining dispute shall be resolved by binding 
            arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration 
            Rules, conducted in Allegheny County, Pennsylvania.
          </li>
          <li>
            <strong>Class Action Waiver:</strong> YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED 
            ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-charcoal mt-8">16. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of Pennsylvania, 
          without regard to conflict of law principles. For any claims not subject to arbitration, you consent to the 
          exclusive jurisdiction and venue of the state and federal courts located in Allegheny County, Pennsylvania.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">17. Severability</h2>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions 
          shall continue in full force and effect. The invalid provision shall be modified to the minimum extent 
          necessary to make it valid and enforceable while preserving the parties' original intent.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">18. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy and any other legal notices or agreements published on the Site, 
          constitute the entire agreement between you and the Agent regarding your use of the Site and supersede all 
          prior agreements and understandings, whether written or oral.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">19. Modifications</h2>
        <p>
          We reserve the right to modify these Terms at any time at our sole discretion. Changes will be effective 
          immediately upon posting to the Site. Your continued use of the Site after any changes constitutes acceptance 
          of the modified Terms. We encourage you to review these Terms periodically.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">20. Contact Information</h2>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="font-semibold">Nicole Marie Severson, Realtor®</p>
          <p>eXp Realty, LLC</p>
          <p>Pittsburgh, Pennsylvania</p>
          <p>Phone: <a href="tel:510-313-3291" className="text-primary hover:underline">(510) 313-3291</a></p>
          <p>Email: <a href="mailto:nicole@exppgh.com" className="text-primary hover:underline">nicole@exppgh.com</a></p>
        </div>

        <h2 className="text-2xl font-bold text-charcoal mt-8">21. Service Cancellations & Refunds</h2>
        <p>
          Real estate brokerage services are professional consulting services that are billed through commission agreements
          or separately negotiated retainers. Once representation services are rendered, fees are considered earned and are
          generally non-refundable. If you choose to terminate a listing agreement, buyer agency agreement, or consulting
          engagement, please provide written notice in accordance with the specific contract terms. You remain responsible
          for reimbursing any third-party expenses incurred on your behalf (photography, staging, MLS fees, etc.).
        </p>
        <p className="mt-2">
          For digital products or educational materials, refunds are only available if expressly stated at point of sale.
          We comply with all Pennsylvania and federal consumer protection laws relating to cancellation rights.
        </p>

        <h2 className="text-2xl font-bold text-charcoal mt-8">22. Acknowledgment and Acceptance</h2>
        <div className="bg-charcoal text-white p-6 rounded-lg mt-4">
          <p className="font-bold mb-2">BY USING THIS WEBSITE, YOU ACKNOWLEDGE AND AGREE THAT:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have read and understood these Terms of Use in their entirety</li>
            <li>You are at least 18 years of age and legally capable of entering into binding contracts</li>
            <li>You accept these Terms and agree to be legally bound by them</li>
            <li>You consent to the limitation of liability and release provisions</li>
            <li>You consent to dispute resolution through arbitration</li>
            <li>You waive your right to participate in class action lawsuits</li>
            <li>You agree to be bound by the terms of eXp Realty, LLC and affiliated vendors</li>
            <li>You understand that Nicole's Assistant is an AI and not a licensed professional</li>
          </ul>
          <p className="mt-4 text-sm">
            If you do not agree to these terms, please discontinue use of this website immediately.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Terms;
