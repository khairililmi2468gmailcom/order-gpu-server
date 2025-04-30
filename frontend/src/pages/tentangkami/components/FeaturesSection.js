import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ShimmerThumbnail, ShimmerTitle } from 'react-shimmer-effects';

const FeaturesSection = ({ loading }) => {
    return (
        <div className="mt-16 px-4 sm:px-8 md:px-16 lg:px-32">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Keunggulan Kami</h2>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 rounded-xl shadow-md p-6 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBolt} size="lg" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                    <div className="bg-gray-100 rounded-xl shadow-md p-6 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUsers} size="lg" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>

                    <div className="bg-gray-100 rounded-xl shadow-md p-6 flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                            <FontAwesomeIcon icon={faChartLine} size="lg" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faBolt} size="lg" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Performa Tinggi</h3>
                        <p className="text-gray-600">Nikmati performa komputasi tak tertandingi.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUsers} size="lg" />
                        </div>
                        <h3 className="text-lg font-semibold text-accent-DEFAULT mb-2">Skalabilitas Fleksibel</h3>
                        <p className="text-gray-600">Skalakan sumber daya sesuai kebutuhan Anda.</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 text-center flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faChartLine} size="lg" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Analisis Mendalam</h3>
                        <p className="text-gray-600">Dapatkan insight berharga dari data Anda.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturesSection;