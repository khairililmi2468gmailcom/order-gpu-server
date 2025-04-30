import React from 'react';
import { Link } from 'react-router-dom';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScrool';
import AboutProdukLayanan from './aboutProdukLayanan/AboutProdukLayanan';
import ProductCard from './productCard/ProductCard';


const ProdukLayananSection = React.forwardRef((props, ref) => {
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });

    return (
        <>
            <div className=' px-5 '>
                <section
                    ref={ctaRef}
                    id="produk-layanan-section"
                    className="py-16 px-4  sm:px-6 lg:px-64 bg-gray-100">
                    <ProductCard />
                </section>
                <section className="py-16 px-4  sm:px-6 lg:px-64">
                    <AboutProdukLayanan />
                </section>
            </div>
        </>
    );
});

export default ProdukLayananSection;