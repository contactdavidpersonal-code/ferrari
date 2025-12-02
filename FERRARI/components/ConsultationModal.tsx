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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-lg w-full max-w-md shadow-2xl overflow-hidden border border-accent/20 rounded-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold">Schedule a Consultation</h3>
            <p className="text-xs text-white/80 mt-0.5">Get personalized guidance from Nicole</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white hover:text-accent-light transition-colors duration-200 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        {status !== 'sent' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
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
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                placeholder="Tell Nicole a bit about what you're looking for..."
              />
            </div>

            {/* Consent */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent.privacy}
                  onChange={(e) => setConsent(prev => ({ ...prev, privacy: e.target.checked }))}
                  required
                />
                <span className="text-xs text-gray-600">
                  I have read and agree to the{' '}
                  <a href="/privacy" className="underline text-primary">Privacy Policy</a> and{' '}
                  <a href="/terms" className="underline text-primary">Terms of Use</a>.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={consent.contact}
                  onChange={(e) => setConsent(prev => ({ ...prev, contact: e.target.checked }))}
                  required
                />
                <span className="text-xs text-gray-600">
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
              className="w-full bg-gradient-to-r from-[#d6af68] via-[#c69750] to-[#a87632] text-primary font-semibold rounded-full py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending...' : 'Request Consultation'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Nicole typically responds within 1 business day.
            </p>
          </form>
        ) : (
          /* Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-serif text-xl font-bold text-primary">Request Sent!</h4>
            <p className="text-gray-600 text-sm">
              Thank you, {formData.name.split(' ')[0]}! Nicole will be in touch soon to schedule your private consultation.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
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

