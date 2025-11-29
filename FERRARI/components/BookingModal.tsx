import React, { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: 'Invest' | 'Finance';
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, source }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPreference: 'email' as 'email' | 'phone' | 'text',
    contactDetails: '',
    appointmentTime: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendBookingToNicole = async () => {
    try {
      // Prepare booking data
      const bookingData = {
        name: formData.name,
        email: formData.contactPreference === 'email' ? formData.contactDetails : '',
        phone: formData.contactPreference === 'phone' || formData.contactPreference === 'text' ? formData.contactDetails : '',
        preferredContactMethod: formData.contactPreference,
        preferredContactTime: formData.appointmentTime,
        message: `${source} consultation booking request. Contact via ${formData.contactPreference}.`,
        source: source,
        buyingStage: source === 'Invest' ? 'Investment Property Interest' : 'Finance/Mortgage Inquiry'
      };

      // Save lead to Neon database and send email (consolidated endpoint)
      const leadsResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!leadsResponse.ok) {
        throw new Error('Failed to save booking');
      }

      const { leadId } = await leadsResponse.json();

      // Legacy: Save to localStorage as backup
      const savedLeads = localStorage.getItem('leads');
      const existingLeads = savedLeads ? JSON.parse(savedLeads) : [];
      
      const newLead = {
        id: leadId || Math.max(...existingLeads.map((l: any) => l.id || 0), 0) + 1,
        name: formData.name || 'Unknown',
        email: bookingData.email,
        phone: bookingData.phone,
        source: source as const,
        interest: source === 'Invest' ? 'Investment Consultation' as const : 'Finance Consultation' as const,
        status: 'New' as const,
        priority: 'High' as const,
        notes: `Contact Preference: ${formData.contactPreference}\nContact Details: ${formData.contactDetails}\nAppointment Time: ${formData.appointmentTime}`,
        noteTimeline: [{
          id: Date.now().toString(),
          content: `New ${source.toLowerCase()} consultation booking request.\n\nContact Preference: ${formData.contactPreference}\nContact Details: ${formData.contactDetails}\nAppointment Time: ${formData.appointmentTime}`,
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
      console.error('Error sending booking:', error);
      throw error;
    }
  };

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        contactPreference: 'email',
        contactDetails: '',
        appointmentTime: ''
      });
      setStatus('idle');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    
    // Basic validation
    if (!formData.name.trim() || !formData.contactDetails.trim() || !formData.appointmentTime.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setStatus('sending');
    try {
      await sendBookingToNicole();
      setStatus('sent');
    } catch (e) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-lg w-full max-w-lg shadow-2xl overflow-hidden mt-16 mb-16 border border-accent/20">
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold">
              Book {source} Consultation
            </h3>
            <p className="text-xs text-white/80 mt-1">Schedule an appointment with Nicole</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white hover:text-accent-light transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    onChange={(e) => handleInputChange('contactPreference', e.target.value as 'email' | 'phone' | 'text')}
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
              {formData.contactPreference === 'email' ? 'Email Address' : 'Phone Number'} *
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

          {/* Status Messages */}
          {status === 'sent' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="text-sm font-medium">✓ Thank you! Your booking request has been sent to Nicole.</p>
              <p className="text-xs mt-1">She will contact you soon to confirm your appointment time.</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">There was an error sending your request. Please try again.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3 px-4 font-semibold hover:from-accent hover:to-accent-light hover:text-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Booking Sent!' : `Book ${source} Consultation`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

