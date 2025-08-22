// app/[locale]/process/page.jsx
import React from 'react';
import ProcessSection from '@/components/ProcessSection';
import CallToAction from '@/components/CallToAction';
import { getDictionary } from '@/lib/getDictionary';

export const dynamic = 'force-static'; // optional if you're statically generating

export default async function ProcessPage({ params }) {
  const resolved = await params;                 // some Next versions require await
  const { locale } = resolved;
  const t = await getDictionary(locale);

  const P = t.process || {};

  const processSteps = [
    // You can attach images however you want; keeping yours for now:
    {
      step: '01',
      title: P.step1_inventory?.title,
      description: P.step1_inventory?.body,
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    },
    {
      step: '02',
      title: P.step2_design?.title,
      description: [P.step2_design?.body, ...(P.step2_design?.updates || [])].filter(Boolean).join('\n\n'),
      image:
        'https://images.unsplash.com/photo-1704283860614-803aa8be7993?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0',
      reverse: true,
    },
    {
      step: '03',
      title: P.step3_printing?.title,
      description: [P.step3_printing?.body, ...(P.step3_printing?.updates || [])].filter(Boolean).join('\n\n'),
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
    {
      step: '04',
      title: P.step4_post_processing?.title,
      description: [P.step4_post_processing?.body, ...(P.step4_post_processing?.updates || [])].filter(Boolean).join('\n\n'),
      image:
        'https://images.unsplash.com/photo-1608112169461-48616144c894?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0',
      reverse: true,
    },
    {
      step: '05',
      title: P.step5_quality_control?.title,
      description: P.step5_quality_control?.body,
      image:
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    },
    {
      step: '06',
      title: P.step6_shipping?.title,
      description: P.step6_shipping?.body,
      reverse: true,
      image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    },
    {
      step: '07',
      title: P.step7_assembly?.title,
      description: P.step7_assembly?.body,
      
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {P.page_title || 'Our Process'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto whitespace-pre-line">
            {P.intro}
          </p>
        </div>
      </div>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {processSteps
            .filter(s => s?.title && s?.description)
            .map((step, idx) => (
              <ProcessSection key={idx} {...step} />
            ))}
        </div>
      </section>

      {/* CTA */}
      <CallToAction
        title={t.cta?.title}
        subtitle={t.cta?.subtitle}
        buttonPrimary={t.cta?.buttonPrimary}
        buttonSecondary={t.cta?.buttonSecondary}
        locale={locale}
      />
    </div>
  );
}
