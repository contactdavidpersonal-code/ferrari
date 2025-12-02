import React, { useState, useEffect, useRef } from 'react';

interface ContactLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactLeadModal: React.FC<ContactLeadModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    contactPreference: 'email', // email, phone, text
    contactDetails: '',
    buyingProcess: '',
    appointmentTime: ''
  });
  const [agreementData, setAgreementData] = useState({
    signature: '',
    signLater: false,
    agreedToTerms: false,
    signedAt: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [consent, setConsent] = useState({
    privacy: false,
    email: false,
    sms: false,
    marketing: false,
  });
  const agreementRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendToNicole = async () => {
    try {
      // Prepare lead data
      const leadData = {
        name: formData.name,
        email: formData.contactPreference === 'email' ? formData.contactDetails : '',
        phone: formData.contactPreference === 'phone' || formData.contactPreference === 'text' ? formData.contactDetails : '',
        preferredContactMethod: formData.contactPreference,
        buyingStage: formData.buyingProcess,
        preferredContactTime: formData.appointmentTime,
        message: `Free consultation request. Contact via ${formData.contactPreference}.${agreementData.signLater ? ' (Listing Agreement - Will sign later)' : ' (Listing Agreement Signed)'}`,
        source: 'Contact Form',
        consent: {
          acknowledgedPolicies: consent.privacy,
          email: consent.email,
          sms: consent.sms,
          marketing: consent.marketing,
        },
        listingAgreement: {
          signed: !agreementData.signLater,
          signature: agreementData.signature,
          signedAt: agreementData.signedAt,
          signLater: agreementData.signLater
        }
      };

      // Save lead to Neon database and send email (consolidated endpoint)
      const leadsResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      if (!leadsResponse.ok) {
        throw new Error('Failed to save lead');
      }

      const { leadId } = await leadsResponse.json();

      // Legacy: Save to localStorage as backup
      const savedLeads = localStorage.getItem('leads');
      const existingLeads = savedLeads ? JSON.parse(savedLeads) : [];
      
      const newLead = {
        id: leadId || Math.max(...existingLeads.map((l: any) => l.id || 0), 0) + 1,
        name: formData.name || 'Unknown',
        email: leadData.email,
        phone: leadData.phone,
        source: 'Contact Form' as const,
        interest: 'Free Consultation' as const,
        status: 'New' as const,
        priority: 'High' as const,
        notes: `Contact Preference: ${formData.contactPreference}\nContact Details: ${formData.contactDetails}\nBuying Process: ${formData.buyingProcess}\nAppointment Time: ${formData.appointmentTime}\nListing Agreement: ${agreementData.signLater ? 'Will sign later' : 'Signed'}\nEmail Consent: ${consent.email ? 'Yes' : 'No'}\nSMS Consent: ${consent.sms ? 'Yes' : 'No'}\nMarketing Opt-In: ${consent.marketing ? 'Yes' : 'No'}`,
        noteTimeline: [{
          id: Date.now().toString(),
          content: `New consultation request from contact form.\n\nContact Preference: ${formData.contactPreference}\nContact Details: ${formData.contactDetails}\nBuying Process: ${formData.buyingProcess}\nAppointment Time: ${formData.appointmentTime}\nListing Agreement: ${agreementData.signLater ? 'Will sign later' : `Signed by ${agreementData.signature} at ${agreementData.signedAt}`}\nEmail Consent: ${consent.email ? 'Yes' : 'No'}\nSMS Consent: ${consent.sms ? 'Yes' : 'No'}`,
          createdAt: new Date().toISOString(),
          author: 'System',
          type: 'General' as const,
          isImportant: true
        }],
        communicationHistory: [],
        propertyTypes: [],
        interestedProperties: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedLeads = [...existingLeads, newLead];
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
    } catch (error) {
      console.error('Error sending lead:', error);
      throw error;
    }
  };

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        name: '',
        contactPreference: 'email',
        contactDetails: '',
        buyingProcess: '',
        appointmentTime: ''
      });
      setAgreementData({
        signature: '',
        signLater: false,
        agreedToTerms: false,
        signedAt: ''
      });
      setStatus('idle');
      setConsent({
        privacy: false,
        email: false,
        sms: false,
        marketing: false,
      });
    }
  }, [isOpen]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for step 1
    if (!formData.name.trim() || !formData.contactDetails.trim() || !formData.buyingProcess.trim() || !formData.appointmentTime.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!consent.privacy) {
      alert('Please acknowledge the Privacy Policy, Terms of Use, and Cookie Policy.');
      return;
    }
    if (formData.contactPreference === 'email' && !consent.email) {
      alert('Please consent to email communications so we can respond via email.');
      return;
    }
    if ((formData.contactPreference === 'phone' || formData.contactPreference === 'text') && !consent.sms) {
      alert('Please consent to phone/SMS communications so we can respond via your selected method.');
      return;
    }

    // Move to step 2
    setCurrentStep(2);
    
    // Scroll to top of agreement
    setTimeout(() => {
      agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    
    // Validate step 2
    if (!agreementData.signLater && !agreementData.signature.trim()) {
      alert('Please provide your signature or check "I will sign later".');
      return;
    }

    if (!agreementData.signLater && !agreementData.agreedToTerms) {
      alert('Please confirm that you agree to the terms of the listing agreement.');
      return;
    }

    // Set signed timestamp if signing now
    if (!agreementData.signLater && !agreementData.signedAt) {
      setAgreementData(prev => ({
        ...prev,
        signedAt: new Date().toISOString()
      }));
    }

    setStatus('sending');
    try {
      await sendToNicole();
      setStatus('sent');
    } catch (e) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div ref={agreementRef} className="bg-white/95 backdrop-blur-lg w-full max-w-2xl shadow-2xl overflow-hidden mt-16 mb-16 border border-accent/20">
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold">
              {currentStep === 1 ? 'Free Consultation Request' : 'Listing Agreement'}
            </h3>
            <p className="text-xs text-white/80 mt-1">Step {currentStep} of 2</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white hover:text-accent-light transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* STEP 1: Contact Form */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method *
            </label>
            <div className="space-y-2">
              {[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone Call' },
                { value: 'text', label: 'Text Message' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="contactPreference"
                    value={option.value}
                    checked={formData.contactPreference === option.value}
                    onChange={(e) => handleInputChange('contactPreference', e.target.value)}
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 mb-1">
              {formData.contactPreference === 'email' ? 'Email Address' : 
               formData.contactPreference === 'phone' ? 'Phone Number' : 'Phone Number'} *
            </label>
            <input
              type={formData.contactPreference === 'email' ? 'email' : 'tel'}
              id="contactDetails"
              value={formData.contactDetails}
              onChange={(e) => handleInputChange('contactDetails', e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={formData.contactPreference === 'email' ? 'your@email.com' : '(555) 123-4567'}
              required
            />
          </div>

          {/* Buying Process */}
          <div>
            <label htmlFor="buyingProcess" className="block text-sm font-medium text-gray-700 mb-1">
              Where are you in the buying process? *
            </label>
            <select
              id="buyingProcess"
              value={formData.buyingProcess}
              onChange={(e) => handleInputChange('buyingProcess', e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select your stage</option>
              <option value="just-looking">Just looking/exploring</option>
              <option value="pre-approved">Pre-approved and ready to buy</option>
              <option value="actively-searching">Actively searching for properties</option>
              <option value="found-property">Found a property I'm interested in</option>
              <option value="ready-to-offer">Ready to make an offer</option>
              <option value="investment">Looking for investment properties</option>
            </select>
          </div>

          {/* Appointment Time */}
          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
              When would you like to be contacted? *
            </label>
            <select
              id="appointmentTime"
              value={formData.appointmentTime}
              onChange={(e) => handleInputChange('appointmentTime', e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select preferred time</option>
              <option value="asap">As soon as possible</option>
              <option value="morning">Morning (8 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
              <option value="weekend">Weekend</option>
              <option value="flexible">I'm flexible</option>
            </select>
          </div>

          {/* Consent Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Communication Consent</p>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent.privacy}
                onChange={(e) => setConsent(prev => ({ ...prev, privacy: e.target.checked }))}
                required
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the <a href="/privacy" className="underline text-primary">Privacy Policy</a>,{' '}
                <a href="/terms" className="underline text-primary">Terms of Use</a>, and <a href="/cookies" className="underline text-primary">Cookie Policy</a>.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent.email}
                onChange={(e) => setConsent(prev => ({ ...prev, email: e.target.checked }))}
                required={formData.contactPreference === 'email'}
              />
              <span className="text-sm text-gray-700">
                I consent to email communications about my inquiry. I can unsubscribe at any time.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent.sms}
                onChange={(e) => setConsent(prev => ({ ...prev, sms: e.target.checked }))}
                required={formData.contactPreference === 'phone' || formData.contactPreference === 'text'}
              />
              <span className="text-sm text-gray-700">
                I consent to phone/SMS communications (message/data rates may apply). Reply STOP to opt out.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent.marketing}
                onChange={(e) => setConsent(prev => ({ ...prev, marketing: e.target.checked }))}
              />
              <span className="text-sm text-gray-700">
                Keep me informed about market updates and occasional promotions (optional).
              </span>
            </label>
          </div>

          {/* Next Button for Step 1 */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3 px-4 font-semibold hover:from-accent hover:to-accent-light hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Next: Review Listing Agreement →
          </button>
        </form>
        )}

        {/* STEP 2: Listing Agreement */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className="p-6 space-y-4">
            {/* Agreement Content */}
            <div className="bg-gray-50 border border-gray-300 p-4 max-h-96 overflow-y-auto text-sm space-y-3">
              <h4 className="font-bold text-base text-gray-900 mb-3">EXCLUSIVE RIGHT TO SELL LISTING AGREEMENT</h4>
              
              <p className="text-gray-700">
                This Exclusive Right to Sell Listing Agreement ("Agreement") is entered into on this day between:
              </p>
              
              <div className="bg-white p-3 border-l-4 border-primary">
                <p><strong>Seller:</strong> {formData.name}</p>
                <p><strong>Contact:</strong> {formData.contactDetails}</p>
              </div>

              <p className="text-gray-700">
                <strong>And</strong> Nicole M. Staack, licensed Realtor with eXp Realty ("Agent").
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">1. LISTING PERIOD</h5>
              <p className="text-gray-700">
                This agreement shall commence on the date signed and continue for a period of six (6) months unless otherwise terminated in accordance with the terms herein.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">2. AGENT'S AUTHORITY</h5>
              <p className="text-gray-700">
                The Seller grants the Agent the exclusive right to market and sell the property. The Agent is authorized to place signage, list the property on Multiple Listing Services (MLS), advertise, and show the property to prospective buyers.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">3. COMMISSION</h5>
              <p className="text-gray-700">
                The Seller agrees to pay the Agent a commission of [percentage to be determined during consultation] of the final sale price upon successful closing of the property.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">4. SELLER'S RESPONSIBILITIES</h5>
              <p className="text-gray-700">
                The Seller agrees to cooperate with the Agent, maintain the property in showable condition, and provide accurate information about the property's condition and features.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">5. MARKETING AND EXPENSES</h5>
              <p className="text-gray-700">
                The Agent will utilize professional marketing materials, online listings, open houses, and other promotional activities at no upfront cost to the Seller.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">6. TERMINATION</h5>
              <p className="text-gray-700">
                Either party may terminate this agreement with written notice if the other party fails to fulfill their obligations. Early termination fees may apply as discussed during consultation.
              </p>

              <h5 className="font-semibold text-gray-900 mt-4">7. ENTIRE AGREEMENT</h5>
              <p className="text-gray-700">
                This Agreement constitutes the entire understanding between the parties. Any modifications must be made in writing and signed by both parties.
              </p>

              <p className="text-gray-600 italic mt-4 text-xs">
                Note: This is a preliminary agreement. Final terms, commission rates, and specific details will be discussed and finalized during your consultation with Nicole M. Staack.
              </p>
            </div>

            {/* Sign Later Checkbox */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementData.signLater}
                  onChange={(e) => setAgreementData(prev => ({
                    ...prev,
                    signLater: e.target.checked,
                    signature: e.target.checked ? '' : prev.signature,
                    agreedToTerms: e.target.checked ? false : prev.agreedToTerms
                  }))}
                  className="mt-1 mr-3 text-cabernet focus:ring-cabernet h-4 w-4"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">I will review and sign this agreement later</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Nicole will bring the final agreement to your consultation for review and signature.
                  </p>
                </div>
              </label>
            </div>

            {/* Signature Section - Only show if NOT signing later */}
            {!agreementData.signLater && (
              <>
                <div>
                  <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
                    Electronic Signature *
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Type your full legal name to sign this agreement</p>
                  <input
                    type="text"
                    id="signature"
                    value={agreementData.signature}
                    onChange={(e) => setAgreementData(prev => ({ ...prev, signature: e.target.value }))}
                    className="w-full bg-white border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cabernet focus:border-transparent font-serif italic text-lg"
                    placeholder="Type your full name here"
                    required={!agreementData.signLater}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreementData.agreedToTerms}
                      onChange={(e) => setAgreementData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                      className="mt-1 mr-3 text-cabernet focus:ring-cabernet h-4 w-4"
                      required={!agreementData.signLater}
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that I have read and agree to the terms of this Exclusive Right to Sell Listing Agreement, and I understand that final terms will be discussed during my consultation with Nicole M. Staack.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Status Messages */}
            {status === 'sent' && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <p className="text-sm font-medium">✓ Thank you! Your consultation request has been sent to Nicole.</p>
                <p className="text-xs mt-1">
                  {agreementData.signLater 
                    ? 'She will bring the listing agreement to your consultation for review and signature.'
                    : 'Your signed agreement has been received. Nicole will contact you within 24 hours.'}
                </p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">There was an error sending your request. Please try again.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                disabled={status === 'sending' || status === 'sent'}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-300"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white py-3 px-4 font-semibold hover:from-accent hover:to-accent-light hover:text-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {status === 'sending' ? 'Submitting...' : status === 'sent' ? 'Request Sent!' : agreementData.signLater ? 'Submit Request' : 'Sign & Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactLeadModal;


