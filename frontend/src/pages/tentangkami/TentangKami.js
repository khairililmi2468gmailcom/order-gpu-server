import React, { useState, useEffect, useRef } from 'react';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScrool';
import VisitorCountSection from './components/VisitorCountSection';
import VisionMissionSection from './components/VisionMissionSection';
import TeamTechSection from './components/TeamTechSection';
import FAQSection from './components/FAQSection';
import FeaturesSection from './components/FeaturesSection';
import CallToActionSection from './components/CallToActionSection';

const TentangKami = () => {
    const [loading, setLoading] = useState(true);
    const [tentangRef, isTentangVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const [visitorCountVisible, setVisitorCountVisible] = useState(false);
    const [accordionStates, setAccordionStates] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const toggleAccordion = (itemId) => {
        setAccordionStates(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));
    };

    useEffect(() => {
        if (isTentangVisible) {
            setLoading(true);
            setVisitorCountVisible(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setLoading(true);
            setVisitorCountVisible(false);
        }
    }, [isTentangVisible]);

    const handleSewaGPUClick = (e) => {
        e.preventDefault();
        const produkLayananSection = document.getElementById('produk-layanan-section');
        if (produkLayananSection) {
            produkLayananSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div ref={tentangRef} className={`py-16 transition-opacity duration-700 ${isTentangVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto text-center">
                <VisitorCountSection loading={loading} visitorCountVisible={visitorCountVisible} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4 sm:px-8 md:px-16 lg:px-32">
                    <VisionMissionSection loading={loading} />
                    <TeamTechSection loading={loading} />
                </div>

                <FAQSection accordionStates={accordionStates} toggleAccordion={toggleAccordion} />

                <FeaturesSection loading={loading} />

                <CallToActionSection loading={loading} handleSewaGPUClick={handleSewaGPUClick} />
            </div>
        </div>
    );
};

export default TentangKami;