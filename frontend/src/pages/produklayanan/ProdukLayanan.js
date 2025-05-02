// ProdukLayananSection.js
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScrool';
import AboutProdukLayanan from './aboutProdukLayanan/AboutProdukLayanan';
import ProductCard from './productCard/ProductCard';

const ProdukLayananSection = React.forwardRef((props, ref) => {
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const productCardRef = useRef(null); // Ref untuk ProductCard

    useEffect(() => {
        if (window.location.hash === '#produk-layanan-section' && productCardRef.current) {
            productCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }
    }, []); // Jalankan sekali setelah mount

    return (
        <>
            <div className='px-5'>
                <section
                    ref={ctaRef}
                    id="produk-layanan-section"
                    className="py-16 px-4 sm:px-6 lg:px-16 xl:px-16 bg-gray-100">
                    <ProductCard ref={productCardRef} /> {/* Pasang ref ke ProductCard */}
                </section>
                <section className="py-16 px-4 sm:px-6 lg:px-16 xl:px-24">
                    <AboutProdukLayanan />
                </section>
            </div>
        </>
    );
});

export default ProdukLayananSection;