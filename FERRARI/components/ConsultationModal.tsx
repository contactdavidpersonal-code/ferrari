import React, { useState, useEffect } from 'react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredTime: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [consent, setConsent] = useState({
    privacy: false,
    contact: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredTime: '',
      });
      setStatus('idle');
      setConsent({ privacy: false, contact: false });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in your name and email.');
      return;
    }
    if (!consent.privacy || !consent.contact) {
      alert('Please accept the required consents to continue.');
      return;
    }

    setStatus('sending');

    try {
      // Send via the leads API which handles Resend email
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          message: formData.message || 'Private consultation request from hero CTA.',
          preferredContactTime: formData.preferredTime,
          source: 'Hero Consultation CTA',
          consent: {
            acknowledgedPolicies: consent.privacy,
            email: true,
            sms: !!formData.phone,
            marketing: false,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to send');

      setStatus('sent');
    } catch (err) {
      console.error('Error sending consultation request:', err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-lg w-full h-full sm:h-auto sm:max-w-md shadow-2xl overflow-y-auto sm:overflow-hidden border-0 sm:border border-accent/20 rounded-none sm:rounded-2xl">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between sticky top-0 z-10">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold truncate">Schedule a Consultation</h3>
            <p className="text-xs text-white/80 mt-0.5">Get personalized guidance from Nicole</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white hover:text-accent-light transition-colors duration-200 p-1 shrink-0"
          >
            <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        {status !== 'sent' ? (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="cons-name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cons-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[44px]"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="cons-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="cons-email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[44px]"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="cons-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="tel"
                id="cons-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[44px]"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="cons-time" className="block text-sm font-medium text-gray-700 mb-1">
                Best Time to Reach You
              </label>
              <select
                id="cons-time"
                value={formData.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[44px]"
              >
                <option value="">Select a time</option>
                <option value="asap">As soon as possible</option>
                <option value="morning">Morning (8 AM – 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
                <option value="evening">Evening (5 PM – 8 PM)</option>
                <option value="weekend">Weekend</option>
                <option value="flexible">I'm flexible</option>
              </select>
            </div>

            {/* Message (optional) */}
            <div>
              <label htmlFor="cons-message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                id="cons-message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-3 sm:py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none min-h-[100px]"
                placeholder="Tell Nicole a bit about what you're looking for..."
              />
            </div>

            {/* Consent */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-3 space-y-2.5 sm:space-y-2">
              <label className="flex items-start gap-2.5 sm:gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-auto sm:h-auto shrink-0"
                  checked={consent.privacy}
                  onChange={(e) => setConsent(prev => ({ ...prev, privacy: e.target.checked }))}
                  required
                />
                <span className="text-xs sm:text-xs text-gray-600 leading-relaxed">
                  I have read and agree to the{' '}
                  <a href="/privacy" className="underline text-primary">Privacy Policy</a> and{' '}
                  <a href="/terms" className="underline text-primary">Terms of Use</a>.
                </span>
              </label>
              <label className="flex items-start gap-2.5 sm:gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-auto sm:h-auto shrink-0"
                  checked={consent.contact}
                  onChange={(e) => setConsent(prev => ({ ...prev, contact: e.target.checked }))}
                  required
                />
                <span className="text-xs sm:text-xs text-gray-600 leading-relaxed">
                  I consent to being contacted by Nicole regarding my inquiry.
                </span>
              </label>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                Something went wrong. Please try again.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-gradient-to-r from-[#d6af68] via-[#c69750] to-[#a87632] text-primary font-semibold rounded-full py-3.5 sm:py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-base sm:text-sm min-h-[48px]"
            >
              {status === 'sending' ? 'Sending...' : 'Request Consultation'}
            </button>

            <p className="text-center text-xs text-gray-500 px-2">
              Nicole typically responds within 1 business day.
            </p>
          </form>
        ) : (
          /* Success State */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-primary">Request Sent!</h4>
            <p className="text-gray-600 text-sm px-2">
              Thank you, {formData.name.split(' ')[0]}! Nicole will be in touch soon to schedule your private consultation.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-3 sm:py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors min-h-[44px] text-base sm:text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;

