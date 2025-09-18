'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import {
  Ship,
  Ruler,
  Puzzle,
  User,
  ClipboardList,
  FileText
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { usePathname } from 'next/navigation';
import { getDictionaryClient } from '@/lib/getDictionaryClient';
// Supabase init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
function get(obj, path, fallback = '') {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj) ?? fallback;
}
const RequestQuote = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
      selectedShip: '',
      scale: '',
      customDesign: {
        hasDrawings: '',
        shipName: '',
        buildOff: '',
        hasRC: '',
        hasPictures: '',
        isSailing: '',
        caseCover: ''
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
    const pathname = usePathname() || '/en';
    const locale = pathname.split('/')[1] || 'en';
  
    // translation state
    const [t, setT] = useState(null);
  
    useEffect(() => {
      (async () => {
        const dict = await getDictionaryClient(locale);
        // assuming your namespace is `quote` (you said “setT(dict?.quote || {})”)
        setT(dict?.quote || {});
      })();
    }, [locale]);


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


    
    const getSteps = () => {
      const base = [
        {
          number: 1,
          title: t?.steps?.select_ship,
          description: t?.titles?.select_ship_sub,
          icon: <Ship size={20} />,
          illustration: "🚢",
        },
      ];
      if (formData.selectedShip === "Custom Design") {
        return [
          ...base,
          { number: 2, title: t?.titles?.custom, description: t?.titles?.scale, icon: <Ruler size={20} />, illustration: "📐" },
          { number: 3, title: t?.titles?.custom, description: t?.titles?.extra_details, icon: <Puzzle size={20} />, illustration: "⚙️" },
          { number: 4, title: t?.steps?.contact, description: t?.titles?.contact_sub, icon: <User size={20} />, illustration: "👤" },
          { number: 5, title: t?.steps?.summary, description: t?.titles?.review_sub, icon: <ClipboardList size={20} />, illustration: "📋" },
        ];
      }
      return [
        ...base,
        { number: 2, title: t?.steps?.scale, description: t?.titles?.scale_sub, icon: <Ruler size={20} />, illustration: "📐" },
        { number: 3, title: t?.steps?.contact, description: t?.titles?.contact_sub, icon: <User size={20} />, illustration: "👤" },
        { number: 4, title: t?.steps?.summary, description: t?.titles?.review_sub, icon: <ClipboardList size={20} />, illustration: "📋" },
      ];
    };
    
    const steps = getSteps();
    const maxSteps = steps.length;
    const nextStep = () => {
      if (currentStep < maxSteps) setCurrentStep(currentStep + 1);
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
        behavior: 'smooth' 
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
      const isCustom = formData.selectedShip === 'Custom Design';

      // Insert into Supabase
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            selected_ship: formData.selectedShip,
            scale: formData.scale || null,
            name: formData.contactInfo.name,
            email: formData.contactInfo.email,
            notes: formData.additionalNotes || null,
            custom_ship_name:          isCustom ? formData.customDesign.shipName      || null : null,
            has_technical_draws: isCustom ? formData.customDesign.hasDrawings   === 'yes' : null,
            is_still_sailing:       isCustom ? formData.customDesign.isSailing     === 'yes' : null,
            has_photos:             isCustom ? formData.customDesign.hasPictures   === 'yes' : null,
            rc_model:               isCustom ? formData.customDesign.hasRC         === 'yes' : null,
            build_ready:            isCustom ? formData.customDesign.buildOff      === 'yes' : null,
            case_cover:             isCustom ? formData.customDesign.caseCover     === 'yes' : null
          }
        ]);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
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
          scale: '',
          customDesign: {
            hasDrawings: '',
            shipName: '',
            buildOff: '',
            hasRC: '',
            hasPictures: '',
            isSailing: '',
            buildOff: '',
            caseCover: ''
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
    
    // Scale selector for EXISTING ships

  
    const renderStep1 = () => {
      return (
        <div className="animate-fade-in">
        <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
  <Ship className="text-slate-400" size={48} />
</div>
          <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.select_ship}</h2>
          <p className="text-gray-300 text-lg">{t?.titles?.select_ship_sub}</p>
        </div>
    
          {/* Search bar */}
          <div className="mb-6 max-w-md mx-auto">
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={t?.titles?.search_ship}
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
                className={`p-6 rounded-2xl border-2 cursor-pointer transform transition-transform duration-300 hover:scale-105 ${
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
              className={`p-6 rounded-2xl border-2 cursor-pointer transform transition-transform duration-300 hover:scale-105 ${
                formData.selectedShip === 'Custom Design'
                  ? 'border-slate-400 bg-slate-800/70'
                  : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
              }`}
            >
              <div className="w-full h-40 bg-gray-700/50 rounded-lg mb-4 flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-300">
                <Puzzle size={28} className="mb-2" />
                <span className="text-lg">{t?.titles?.custom}</span>
              </div>
              </div>
              <h3 className="text-xl font-semibold text-white text-center">{t?.titles?.custom}</h3>
            </div>
            
          </div>
        </div>
      );
    };
    
    
    const renderScaleStep = () => (
      <div className="animate-fade-in">
      <div className="text-center mb-12">
      <div className="flex justify-center mb-4">
        <Ruler className="text-slate-400" size={48} />
      </div>
        <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.scale_ex}</h2>
        <p className="text-gray-300 text-lg">{t?.titles?.scale_ex}</p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['1:50', '1:75', '1:100', 'custom'].map((scale, index) => (
            <div
              key={scale}
              onClick={() => updateFormData(null, 'scale', scale)}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-300 hover-scale ${
                formData.scale === scale
                  ? 'bg-gray-700 text-white shadow-lg shadow-gray-700/25'
                  : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 border border-gray-600'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <Ruler className="mx-auto mb-2" size={24} />
                <span className="font-medium">{scale === 'custom' ? 'Custom' : scale}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  
    );
  
    const renderStep2Custom = () => (
      <div className="animate-fade-in">
        <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Ruler className="text-slate-400" size={48} />
        </div>         
          <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.custom_details}</h2>
          <p className="text-gray-300 text-lg">{t?.titles?.custom_details_sub}</p>
        </div>
  
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="animate-slide-in-right">
            <label className="block text-gray-300 mb-3 text-lg font-medium">{t?.fields?.ship_name}</label>
            <input
              type="text"
              value={formData.customDesign.shipName}
              onChange={(e) => updateFormData('customDesign', 'shipName', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              placeholder={t?.fields?.ship_name_ph}
            />
          </div>
  
          {[
            ['hasRC', t?.fields?.rc],
            ['buildOff', t?.fields?.build_off],
          ].map(([key, label], index) => {
            const value = formData.customDesign[key];
            
            return (
              <div key={key} className="animate-slide-in-right" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                <label className="block text-gray-300 mb-4 text-lg font-medium">{label}</label>
                <div className="flex border border-gray-600 rounded-xl overflow-hidden bg-gray-800/50">
                  {/* YES option */}
        <div
          onClick={() => updateFormData('customDesign', key, 'yes')}
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            value === 'yes' ? 'bg-gray-600 text-white font-medium' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
           {t?.buttons?.yes}
        </div>

        {/* NO option */}
        <div
          onClick={() => updateFormData('customDesign', key, 'no')}
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            value === 'no' ? 'bg-gray-600 text-white font-medium' : 'bg-gray-800 hover:bg-gray-700'
          } border-l border-gray-600`}
        >
          {t?.buttons?.no}
        </div>
                </div>
              </div>
            );
          })}
          
          <div className="animate-slide-in-right" style={{ animationDelay: '600ms' }}>
            <label className="block text-gray-300 mb-3 text-lg font-medium">{t?.titles?.scale}</label>
            <select
              value={formData.scale}
              onChange={(e) => updateFormData(null, 'scale', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
            >
              <option value="">{t?.titles?.scale_sub}</option>
              <option value="1:50">1:50</option>
              <option value="1:75">1:75</option>
              <option value="1:100">1:100</option>
              
              <option value="custom">Custom Scale</option>
            </select>
          </div>
        </div>
      </div>
    );
  
    const renderCustomDesignQuestions = () => (
      <div>
    <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Puzzle className="text-slate-400" size={48} />
        </div>         
          <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.extra_details}</h2>
          <p className="text-gray-300 text-lg">{t?.titles?.extra_details_sub}</p>
        </div>          
         <div className="max-w-2xl mx-auto space-y-6">
                {[
          ['hasDrawings', t?.fields?.has_drawings],
          ['isSailing', t?.fields?.is_sailing],
          ['hasPictures', t?.fields?.has_pictures],
          ['caseCover', t?.fields?.case_cover]
        ].map(([key, label]) => {
          const value = formData.customDesign[key];

  return (
    <div key={key} className="mb-6">
      <label className="block text-gray-300 mb-2 text-lg">{label}</label>
      <div className="flex border border-gray-600 rounded-lg overflow-hidden text-white text-center text-lg">
        {/* YES option */}
        <div
          onClick={() => updateFormData('customDesign', key, 'yes')}
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            value === 'yes' ? 'bg-gray-600 text-white font-medium' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
           {t?.buttons?.yes}
        </div>

        {/* NO option */}
        <div
          onClick={() => updateFormData('customDesign', key, 'no')}
          className={`w-1/2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            value === 'no' ? 'bg-gray-600 text-white font-medium' : 'bg-gray-800 hover:bg-gray-700'
          } border-l border-gray-600`}
        >
           {t?.buttons?.no}
        </div>
      </div>
    </div>
  );
})}

    
         
        </div>
      </div>
    );

    const renderContactStep = () => (
      <div>
        <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <User className="text-slate-400" size={48} />
        </div>         
          <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.contact_title}</h2>
          <p className="text-gray-300 text-lg">{t?.titles?.contact_sub}</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">{t?.fields?.full_name} *</label>
            <input
              type="text"
              value={formData.contactInfo.name}
              onChange={(e) => updateFormData('contactInfo', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
              placeholder={t?.fields?.full_name}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">{t?.fields?.email} *</label>
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
            <label className="block text-gray-300 mb-2">{t?.fields?.phone}</label>
            <input
              type="tel"
              value={formData.contactInfo.phone}
              onChange={(e) => updateFormData('contactInfo', 'phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none"
              placeholder="+31 (0) 12 3456789 "
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">{t?.fields?.notes_label}</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => updateFormData(null, 'additionalNotes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-slate-400 focus:outline-none resize-none"
              placeholder={t?.fields?.notes_placeholder}
            />
          </div>
        </div>
      </div>
    );
  
    
    
    const renderStep4 = () => (
      <div className="animate-fade-in">
        <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <ClipboardList className="text-slate-400" size={48} />
        </div> 
          <h2 className="text-3xl font-bold text-white mb-4">{t?.titles?.review_title}</h2>
          <p className="text-gray-300 text-lg">{t?.titles?.review_sub}</p>
        </div>
  
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-800/70 to-gray-900/70 rounded-2xl p-8 space-y-6 border border-gray-600 backdrop-blur-sm">
          <div className="animate-slide-in-right">
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <Ship className="mr-2" size={20} />
              {t?.review?.selected_ship}
            </h3>
            <p className="text-gray-300 pl-7">{formData.selectedShip || 'Not selected'}</p>
          </div>
          
          <div className="animate-slide-in-right" style={{ animationDelay: '150ms' }}>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <Ruler className="mr-2" size={20} />
              {t?.steps?.scale}
            </h3>
            <p className="text-gray-300 pl-7">{formData.scale || 'Not specified'}</p>
          </div>
          
          <div className="animate-slide-in-right" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <User className="mr-2" size={20} />
            {t?.titles?.contact_title}
            </h3>
            <div className="text-gray-300 space-y-1 pl-7">
              <p>{t?.fields?.full_name}: {formData.contactInfo.name}</p>
              <p>{t?.fields.email}: {formData.contactInfo.email}</p>
              <p>{t?.fields?.phone}: {formData.contactInfo.phone || 'Not provided'}</p>
            </div>
          </div>
          
          {formData.additionalNotes && (
            <div className="animate-slide-in-right" style={{ animationDelay: '450ms' }}>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <FileText className="mr-2" size={20} />
                {t?.fields?.notes_label}
              </h3>
              <p className="text-gray-300 pl-7">{formData.additionalNotes}</p>
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
          <div className="flex justify-center items-center gap-4 sm:gap-8 flex-nowrap overflow-x-auto">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex flex-col items-center ${step.number <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step.number < currentStep 
                        ? 'bg-slate-600 text-white' 
                        : step.number === currentStep
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {step.number < currentStep ? <Check size={20} /> : step.icon}
                    </div>
                    <span className="text-sm font-medium text-center">{step.title}</span>
                  </div>
                  {step.number < maxSteps && (
                  <div className={`hidden sm:block w-10 h-0.5 mx-4 ${step.number < currentStep ? 'bg-slate-600' : 'bg-gray-700'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
  
          {/* Step Content */}
          <div className="mb-12 relative min-h-[400px]">
          <AnimatePresence mode="wait">
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      layout
    >
          {currentStep === 1 && renderStep1()}
          

        {formData.selectedShip === 'Custom Design' && currentStep === 2 && renderStep2Custom()}
        {formData.selectedShip !== 'Custom Design' && currentStep === 2 && renderScaleStep()}

        {formData.selectedShip === 'Custom Design' && currentStep === 3 && renderCustomDesignQuestions()}
        {formData.selectedShip !== 'Custom Design' && currentStep === 3 && renderContactStep()}

        {formData.selectedShip === 'Custom Design' && currentStep === 4 && renderContactStep()}
        {formData.selectedShip !== 'Custom Design' && currentStep === 4 && renderStep4()}

        {formData.selectedShip === 'Custom Design' && currentStep === 5 && renderStep4()}


        </motion.div>
  </AnimatePresence>
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
              {t?.buttons?.previous}
            </button>
  
            {currentStep < maxSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
            >
              {t?.buttons?.next}
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
                 {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t?.buttons?.submitting}
                </div>
              ) : (
                t?.buttons?.submit
              )}
            </button>
            )}
          

          </div>
        </div>
      </div>
    );
  };
  
  export default RequestQuote;
