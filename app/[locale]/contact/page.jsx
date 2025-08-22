'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getDictionaryClient } from '@/lib/getDictionaryClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Contact() {
  const pathname = usePathname() || '/en';
  const locale = pathname.split('/')[1] || 'en';

  const [t, setT] = useState(null);
  useEffect(() => {
    (async () => {
      const dict = await getDictionaryClient(locale);
      setT(dict?.contact || {});
    })();
  }, [locale]);

  // If you still want categories somewhere else, keep this fetch.
  // For Contact (per client), ship type is removed, so we can skip it.
  // Leaving categories state here if you decide to re-enable later.
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    details: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('quote_requests').insert([{
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      selected_ship: null,         // no ship type on this page
      notes: formData.details,
      status: 'Received'
    }]);
    if (error) {
      console.error(error);
      alert('There was an error submitting your request. Please try again.');
    } else {
      alert('Your message has been sent successfully!');
      setFormData({ firstName: '', lastName: '', email: '', details: '' });
    }
  };

  if (!t) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.header?.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.header?.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              {t.form?.title}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.form?.first_name_label}
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder={t.form?.first_name_label}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t.form?.last_name_label}
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder={t.form?.last_name_label}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form?.email_label}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="john@example.com"
                />
              </div>

              {/* No ship type per client request */}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t.form?.message_label}
                </label>
                <textarea
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={t.form?.message_placeholder}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {t.form?.submit}
              </button>
            </form>
          </div>

          {/* FAQ (replaces About) */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">{t.faq?.title}</h2>

              <div className="divide-y divide-gray-700">
                {(t.faq?.items || []).map((item, idx) => (
                  <details key={idx} className="py-4 group">
                    <summary className="cursor-pointer text-white font-semibold list-none flex justify-between items-center">
                      <span>{item.q}</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">⌄</span>
                    </summary>
                    <p className="mt-3 text-gray-300 whitespace-pre-line">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* (Optional) Contact info card could stay or be removed; omitted here per brief */}
          </div>
        </div>
      </div>
    </div>
  );
}
