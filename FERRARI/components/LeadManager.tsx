import React, { useState, useEffect } from 'react';
import { Lead, Communication, Note } from '../types';
import { leadsService, communicationsService, notesService } from '../lib/jsonbinService';

interface LeadManagerProps {
  onBack: () => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({ onBack }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showAddLead, setShowAddLead] = useState(false);

  // Load leads from Supabase on component mount
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const supabaseLeads = await leadsService.getAll();
        setLeads(supabaseLeads);
        console.log('Loaded leads from Supabase:', supabaseLeads.length);
      } catch (error) {
        console.error('Error loading leads from Supabase:', error);
        alert('Failed to load leads. Please check your Supabase connection.');
        setLeads([]);
      }
    };
    loadLeads();
  }, []);

  // Filter leads based on selected filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredLeads(leads);
    } else if (activeFilter === 'new') {
      setFilteredLeads(leads.filter(lead => lead.status === 'New'));
    } else if (activeFilter === 'high-priority') {
      setFilteredLeads(leads.filter(lead => lead.priority === 'High'));
    } else if (activeFilter === 'follow-up') {
      const today = new Date().toISOString().split('T')[0];
      setFilteredLeads(leads.filter(lead => lead.nextFollowUp === today));
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === activeFilter));
    }
  }, [leads, activeFilter]);

  const handleAddLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const leadData = {
        ...lead,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const newLead = await leadsService.create(leadData);
      setLeads(prev => [...prev, newLead]);
      console.log('Lead created successfully in Supabase');
      setShowAddLead(false);
    } catch (error) {
      console.error('Error creating lead in Supabase:', error);
      alert('Failed to create lead. Please check your Supabase connection and try again.');
    }
  };

  const handleUpdateLead = async (id: number, updates: Partial<Lead>) => {
    try {
      const updatedLead = await leadsService.update(id, updates);
      setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
      
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(updatedLead);
      }
      console.log('Lead updated successfully in Supabase');
    } catch (error) {
      console.error('Error updating lead in Supabase:', error);
      alert('Failed to update lead. Please check your Supabase connection and try again.');
    }
  };

  const handleAddCommunication = async (leadId: number, communication: Omit<Communication, 'id'>) => {
    try {
      const communicationData = {
        ...communication,
        leadId: leadId,
        timestamp: new Date().toISOString()
      };
      const newCommunication = await communicationsService.create(communicationData);
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              communicationHistory: [...lead.communicationHistory, newCommunication],
              updatedAt: new Date().toISOString()
            }
          : lead
      ));
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ 
          ...selectedLead, 
          communicationHistory: [...selectedLead.communicationHistory, newCommunication],
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Communication added successfully in Supabase');
    } catch (error) {
      console.error('Error adding communication in Supabase:', error);
      alert('Failed to add communication. Please check your Supabase connection and try again.');
    }
  };

  const handleAddNote = async (leadId: number, note: Omit<Note, 'id'>) => {
    try {
      const noteData = {
        ...note,
        leadId: leadId,
        createdAt: new Date().toISOString()
      };
      const newNote = await notesService.create(noteData);
      
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              noteTimeline: [...lead.noteTimeline, newNote],
              updatedAt: new Date().toISOString()
            }
          : lead
      ));
      
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ 
          ...selectedLead, 
          noteTimeline: [...selectedLead.noteTimeline, newNote],
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Note added successfully in Supabase');
    } catch (error) {
      console.error('Error adding note in Supabase:', error);
      alert('Failed to add note. Please check your Supabase connection and try again.');
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    const match = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - EXACT Frontend Match */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between mb-4">
            {/* Left - Home Button */}
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-semibold flex items-center gap-2"
              title="Return to Frontend"
            >
              🏠 Home
            </button>

            {/* Center - Logo/Brand */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-1">
                Lead Manager
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Manage leads and customer inquiries • {leads.length} total leads
              </p>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddLead(true)}
                className="bg-cabernet hover:bg-cabernet/90 text-white py-2 px-4 rounded-md transition-colors duration-300 font-semibold"
              >
                Add Lead
              </button>
              <button
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-semibold"
              >
                Properties
              </button>
            </div>
          </div>

          {/* Navigation Bar - EXACT Frontend Style */}
          <nav className="flex justify-center space-x-8 border-t border-gray-200 pt-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeFilter === 'all'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeFilter === 'new'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New ({leads.filter(l => l.status === 'New').length})
            </button>
            <button
              onClick={() => setActiveFilter('high-priority')}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeFilter === 'high-priority'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              High Priority ({leads.filter(l => l.priority === 'High').length})
            </button>
            <button
              onClick={() => setActiveFilter('follow-up')}
              className={`py-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeFilter === 'follow-up'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Follow Up ({leads.filter(l => l.nextFollowUp === new Date().toISOString().split('T')[0]).length})
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Header - EXACT Frontend Style */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Lead Management Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Track and manage all your customer inquiries and leads
          </p>
        </div>

        {/* Statistics Cards - Frontend Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {leads.filter(l => l.status === 'New').length}
            </div>
            <div className="text-gray-600 font-medium">New Leads</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {leads.filter(l => l.priority === 'High').length}
            </div>
            <div className="text-gray-600 font-medium">High Priority</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">
              {leads.filter(l => l.status === 'Contacted').length}
            </div>
            <div className="text-gray-600 font-medium">Contacted</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {leads.filter(l => l.status === 'Qualified').length}
            </div>
            <div className="text-gray-600 font-medium">Qualified</div>
          </div>
        </div>

        {/* Leads List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeFilter === 'all' ? 'All Leads' : 
                   activeFilter === 'new' ? 'New Leads' :
                   activeFilter === 'high-priority' ? 'High Priority Leads' :
                   'Follow Up Today'}
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredLeads.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <div className="text-4xl mb-4">📞</div>
                    <p>No leads found</p>
                  </div>
                ) : (
                  filteredLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                        selectedLead?.id === lead.id 
                          ? 'bg-cabernet/10 border-l-4 border-l-cabernet' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.priority === 'High' ? 'bg-red-100 text-red-800' :
                          lead.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{lead.email}</p>
                      <p className="text-sm text-gray-600">{formatPhoneNumber(lead.phone)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="lg:col-span-2">
            {selectedLead ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-300 font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <p className="text-gray-600 mb-1">📧 {selectedLead.email}</p>
                      <p className="text-gray-600 mb-1">📞 {formatPhoneNumber(selectedLead.phone)}</p>
                      <p className="text-gray-600">📍 {selectedLead.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Lead Details</h4>
                      <p className="text-gray-600 mb-1">Status: <span className="font-medium">{selectedLead.status}</span></p>
                      <p className="text-gray-600 mb-1">Priority: <span className="font-medium">{selectedLead.priority}</span></p>
                      <p className="text-gray-600 mb-1">Budget: <span className="font-medium">${selectedLead.budget?.toLocaleString()}</span></p>
                      <p className="text-gray-600">Created: <span className="font-medium">{new Date(selectedLead.createdAt).toLocaleDateString()}</span></p>
                    </div>
                  </div>
                  
                  {selectedLead.notes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedLead.notes}</p>
                    </div>
                  )}

                  {selectedLead.communicationHistory.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Communication History</h4>
                      <div className="space-y-3">
                        {selectedLead.communicationHistory.map(comm => (
                          <div key={comm.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{comm.type}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(comm.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{comm.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLead.noteTimeline.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Note Timeline</h4>
                      <div className="space-y-3">
                        {selectedLead.noteTimeline.map(note => (
                          <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{note.type}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(note.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600">{note.content}</p>
                            {note.isImportant && (
                              <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                Important
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-6">👤</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Select a Lead</h3>
                <p className="text-gray-600">
                  Choose a lead from the list to view details and manage communication.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};