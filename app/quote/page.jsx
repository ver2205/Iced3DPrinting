'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RequestQuote = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      selectedShip: '',
      customDimensions: {
        length: '',
        width: '',
        height: '',
        scale: ''
      },
      contactInfo: {
        name: '',
        email: '',
        phone: ''
      },
      additionalNotes: ''
    });
    const [latestShips, setLatestShips] = useState([]);
    const [allShips, setAllShips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const fetchShips = async () => {
        // Fetch latest 3
        const { data: latest, error: latestError } = await supabase
        .from('ship')
        .select(`
          id,
          slug,
          ship_images(image_url, alt_text)
        `)
        .order('created_at', { ascending: false })
        .limit(3);
        if (!latestError) setLatestShips(latest);

        // Fetch all ships
        const { data: all, error: allError } = await supabase
        .from('ship')
        .select(`
          id,
          slug,
          ship_images(image_url, alt_text)
        `);
        
        if (!allError) setAllShips(all);
      };
  
      fetchShips();
    }, []);


    
    const steps = [
      { number: 1, title: "Select Ship", description: "Choose a base model or custom design" },
      { number: 2, title: "Dimensions", description: "Specify size and scale requirements" },
      { number: 3, title: "Contact Info", description: "Provide your contact details" },
      { number: 4, title: "Summary", description: "Review and submit your request" }
    ];
  
    const nextStep = () => {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    };
  
    const prevStep = () => {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
    };
  
    const updateFormData = (section, field, value) => {
      if (section) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
    };

    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // optional: makes the scroll animated
      });
    }, [currentStep]);
    

    useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000); // 5000 ms = 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount or if successMessage changes
  }
}, [successMessage]);
    const handleSubmit = async () => {
      // Basic validation
      if (!formData.contactInfo.name || !formData.contactInfo.email) {
       
        setSuccessMessage('Please provide your name and email.');

        return;
      }
      setLoading(true);

      // Insert into Supabase
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            selected_ship: formData.selectedShip,
            length: formData.customDimensions.length || null,
            width: formData.customDimensions.width || null,
            height: formData.customDimensions.height || null,
            scale: formData.customDimensions.scale || null,
            name: formData.contactInfo.name,
            email: formData.contactInfo.email,
            notes: formData.additionalNotes || null
          }
        ]);
    
      if (error) {
        console.error("Submission error:", error);
        setSuccessMessage('Something went wrong. Please try again.');
      } else {
        setSuccessMessage('Your quote request has been submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);

        // Optionally reset form

        setCurrentStep(1);
        setFormData({
          selectedShip: '',
          customDimensions: {
            length: '',
            width: '',
            height: '',
            scale: ''
          },
          contactInfo: {
            name: '',
            email: '',
            phone: ''
          },
          additionalNotes: ''
        });
      }
      setLoading(false);

    };
    
  
    const renderStep1 = () => {
      return (
        <div>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Select a Ship Model</h2>
    
          {/* Search bar */}
          <div className="mb-6 max-w-md mx-auto">
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search for a ship..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <div className="bg-gray-800 border border-gray-600 rounded-lg mt-2 max-h-48 overflow-y-auto">
                {allShips
                  .filter(ship => ship.slug.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(ship => (
                    <div 
                      key={ship.id}
                      onClick={() => {
                        updateFormData(null, 'selectedShip', ship.slug);
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-slate-700 text-white"
                    >
                      {ship.slug}
                    </div>
                  ))}
              </div>
            )}
          </div>
    
          {/* Ship cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestShips.map((ship) => (
              <div
                key={ship.id}
                onClick={() => updateFormData(null, 'selectedShip', ship.slug)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.selectedShip === ship.slug
                    ? 'border-slate-400 bg-slate-800/70'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
              >
{ship.ship_images?.[0]?.image_url ? (
  <img
    src={ship.ship_images[0].image_url}
    alt={ship.ship_images[0].alt_text || ship.slug}
    className="w-full h-40 object-cover rounded-lg mb-4"
  />
) : (
  <div className="w-full h-40 bg-gray-700/50 rounded-lg mb-4 flex items-center justify-center">
    <span className="text-gray-400 text-lg">{ship.slug}</span>
  </div>
)}

              
                <h3 className="text-xl font-semibold text-white text-center">{ship.slug}</h3>
              </div>
            ))}
    
            {/* Custom Design */}
            <div
              onClick={() => updateFormData(null, 'selectedShip', 'Custom Design')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                formData.selectedShip === 'Custom Design'
                  ? 'border-slate-400 bg-slate-800/70'
                  : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
              }`}
            >
              <div className="w-full h-40 bg-gray-700/50 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Custom Design</span>
              </div>
              <h3 className="text-xl font-semibold text-white text-center">Custom Design</h3>
            </div>
            
          </div>
        </div>
      );
    };
    
    
    
  
    const renderStep2 = () => (
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Custom Dimensions</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Length (m)</label>
              <input
                type="number"
                value={formData.customDimensions.length}
                onChange={(e) => updateFormData('customDimensions', 'length', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
                placeholder="85"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Width (m)</label>
              <input
                type="number"
                value={formData.customDimensions.width}
                onChange={(e) => updateFormData('customDimensions', 'width', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Height (m)</label>
              <input
                type="number"
                value={formData.customDimensions.height}
                onChange={(e) => updateFormData('customDimensions', 'height', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
                placeholder="70"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Preferred Scale</label>
            <select
              value={formData.customDimensions.scale}
              onChange={(e) => updateFormData('customDimensions', 'scale', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
            >
              <option value="">Select scale</option>
              <option value="1:50">1:50</option>
              <option value="1:75">1:75</option>
              <option value="1:100">1:100</option>
              <option value="1:150">1:150</option>
              <option value="custom">Custom Scale</option>
            </select>
          </div>
        </div>
      </div>
    );
  
    const renderStep3 = () => (
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Information</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.contactInfo.name}
              onChange={(e) => updateFormData('contactInfo', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => updateFormData('contactInfo', 'email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(e) => updateFormData('contactInfo', 'phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => updateFormData(null, 'additionalNotes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none resize-none"
              placeholder="Any specific requirements, materials, or details you'd like to include..."
            />
          </div>
        </div>
      </div>
    );
  
    const renderStep4 = () => (
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Review Your Request</h2>
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-2xl p-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Selected Ship</h3>
            <p className="text-gray-300">{formData.selectedShip || 'Not selected'}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Dimensions</h3>
            <div className="text-gray-300 space-y-1">
              <p>Length: {formData.customDimensions.length || 'Not specified'} m</p>
              <p>Width: {formData.customDimensions.width || 'Not specified'} m</p>
              <p>Height: {formData.customDimensions.height || 'Not specified'} m</p>
              <p>Scale: {formData.customDimensions.scale || 'Not specified'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Contact Information</h3>
            <div className="text-gray-300 space-y-1">
              <p>Name: {formData.contactInfo.name}</p>
              <p>Email: {formData.contactInfo.email}</p>
              <p>Phone: {formData.contactInfo.phone || 'Not provided'}</p>
            </div>
          </div>
          
          {formData.additionalNotes && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Additional Notes</h3>
              <p className="text-gray-300">{formData.additionalNotes}</p>
            </div>
          )}
        </div>
      </div>
    );
  
    return (
      <div className="min-h-screen bg-gray-900">
    

        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {successMessage && (
  <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 text-center px-4 py-2 rounded-lg shadow-lg max-w-sm w-auto z-50">
  {successMessage}
</div>
)}
          {/* Progress Steps */}
          <div className="mb-12">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${step.number <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      step.number < currentStep 
                        ? 'bg-slate-600 text-white' 
                        : step.number === currentStep
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {step.number < currentStep ? <Check size={20} /> : step.number}
                    </div>
                    <span className="text-sm font-medium text-center">{step.title}</span>
                  </div>
                  {step.number < 4 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-4 ${step.number < currentStep ? 'bg-slate-600' : 'bg-gray-700'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Step Content */}
          <div className="mb-12">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
  
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <ChevronLeft className="mr-2" size={20} />
              Previous
            </button>
  
            {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
            >
              Next
              <ChevronRight className="ml-2" size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-xl hover:shadow-2xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            )}
          

          </div>
        </div>
      </div>
    );
  };
  
  export default RequestQuote;
