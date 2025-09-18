// app/page.jsx
import { getDictionary } from '@/lib/getDictionary';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import CallToAction from '@/components/CallToAction';
import ProcessSteps from '@/components/ProcessSteps';

export function generateStaticParams() {
  return ['en', 'nl'].map((locale) => ({ locale }));
}

export default async function HomePage({ params }) {
  const resolvedParams = await params; // ✅ await it
  const { locale } = resolvedParams;
  const t = await getDictionary(locale); // load the right JSON

  return (
    <div className='min-h-screen bg-gray-900'>
      <HeroSection
        locale={locale}
        tagline={t['1']?.tagline}
        tagline2={t['1']?.tagline2}
        intro={t['2']?.intro}
        viewCatalogueLabel={t.buttons?.view_catalogue}
        requestQuoteLabel={t.buttons?.request_quote}
      />

      <FeatureSection
        locale={locale}
        title={t['3']?.our_story_title} // 3
        description={t['4']?.our_story_body} // 4
        features={t['5']?.qualities || []} // 5 (list)
        note={t['5']?.qualities_note} // 5 (note under list)
        imageUrl='https://pub-6210d406bed545ddaeb6b12199553fc4.r2.dev/home1.jpg'
        imageAlt='Ship Design and Engineering'
        ctaLabel={t.buttons?.learn_more}
        ctaHref={`/${locale}/process`}
      />
      <ProcessSteps
        heading={t['6']?.steps_title}
        intro={t['7']?.steps_intro}
        steps={[
          { title: t['8']?.step1_title, desc: t['8']?.step1_desc },
          { title: t['9']?.step2_title, desc: t['9']?.step2_desc },
          { title: t['10']?.step3_title, desc: t['10']?.step3_desc },
          { title: t['11']?.step4_title, desc: t['11']?.step4_desc },
          { title: t['12']?.step5_title, desc: t['12']?.step5_desc },
        ]}
        moreInfoLabel={t.buttons?.more_information}
      />

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
