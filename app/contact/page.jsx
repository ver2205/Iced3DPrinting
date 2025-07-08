"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


const Contact = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
          const { data, error } = await supabase.from('category').select('*').order('name');
      
          if (error) {
            console.error('Error fetching categories:', error);
          } else {
            setCategories(data);
          }
        };
      
        fetchCategories();
      }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const { error } = await supabase.from('quote_requests').insert([{
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          selected_ship: formData.shipType,
          notes: formData.details,
          status: 'Received'
        }]);
      
        if (error) {
          console.error('Failed to submit contact form:', error);
          alert('There was an error submitting your request. Please try again.');
        } else {
          alert('Your quote request has been sent successfully!');
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            shipType: '',
            details: ''
          });
        }
      };
      


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        shipType: '',
        details: ''
      });

  return (
    <div className="min-h-screen bg-gray-900">
      

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact & About Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our naval modeling experts and learn about our passion for maritime excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Get Your Custom Quote</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ship Type</label>
                <select
                value={formData.shipType}
                onChange={(e) => setFormData({ ...formData, shipType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                <option value="">Select a ship type</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                    {cat.name}
                    </option>
                ))}
                </select>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Project Details</label>
                <textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tell us about your project, preferred scale, timeline, and any specific requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* About + Contact Info */}
          <div className="space-y-8">
            
            <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">About Iced3DPrinting</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded by maritime enthusiasts and naval historians, Iced3DPrinting specializes in creating 
                  museum-quality 3D printed ship models that capture the essence of naval engineering excellence.
                </p>
                <p>
                  Our team combines decades of naval expertise with cutting-edge 3D printing technology 
                  to deliver precision models that honor the legacy of maritime vessels from across history.
                </p>
                <p>
                  From historic warships that shaped world events to modern naval marvels, we're passionate 
                  about bringing these magnificent vessels to life in stunning detail.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white">Address</h3>
                  <p>123 Maritime Drive<br />Naval District, Port City 12345<br />United States</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p>info@Iced3DPrinting.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Business Hours</h3>
                  <p>Mon - Fri: 9 AM - 6 PM<br />Sat: 10 AM - 4 PM<br />Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Why Choose Iced3DPrinting?</h2>
              <div className="space-y-4 text-gray-300">
                {[
                  ["Expert Naval Knowledge", "Our team includes naval historians and marine engineers"],
                  ["Precision 3D Printing", "State-of-the-art technology for incredible detail"],
                  ["Custom Solutions", "Tailored models for collectors and institutions"],
                  ["Worldwide Shipping", "Safe delivery to collectors around the globe"]
                ].map(([title, desc], idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="w-3 h-3 bg-slate-800 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
