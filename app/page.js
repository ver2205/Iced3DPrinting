// app/page.jsx

import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import CallToAction from '../components/CallToAction';
import ProcessSteps from '../components/ProcessSteps';
export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-900'>
      <HeroSection />
      <FeatureSection
        title='Precision Design Process'
        description='Our expert team combines traditional maritime knowledge with cutting-edge 3D modeling technology to create ships that are both historically accurate and structurally perfect.'
        imageUrl='https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        imageAlt='Ship Design and Engineering'
        features={[
          'CAD modeling with millimeter precision',
          'Historical research and accuracy verification',
          'Structural integrity analysis',
          'Custom modifications available',
        ]}
      />
      <ProcessSteps />

      <CallToAction />
    </div>
  );
}
