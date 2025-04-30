import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faCode } from '@fortawesome/free-solid-svg-icons';
import { ShimmerThumbnail, ShimmerTitle } from 'react-shimmer-effects';

const TeamTechSection = ({ loading }) => {
    return (
        <>
            {loading ? (
                <>
                    <div className="bg-gray-100 rounded-xl shadow-md p-8 border-b-4 border-gray-300 flex flex-col items-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUserTie} size="2x" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                    <div className="bg-gray-100 rounded-xl shadow-md p-8 border-b-4 border-gray-300 flex flex-col items-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faCode} size="2x" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                </>
            ) : (
                <>
                    {/* Tim Profesional */}
                    <div className="bg-white rounded-xl shadow-md hover:border p-8 text-gray-800 border-b-4 border-primary flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-500" >
                            <FontAwesomeIcon icon={faUserTie} size="2x" className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">Tim Profesional</h3>
                        <p className="leading-relaxed text-center">
                            Kami terdiri dari para ahli di bidang infrastruktur komputasi, pengembangan perangkat lunak, dan dukungan pelanggan yang berdedikasi untuk memberikan layanan terbaik.
                        </p>
                    </div>

                    {/* Teknologi Terdepan */}
                    <div className="bg-white rounded-xl shadow-md hover:border p-8 text-gray-800 border-b-4 border-blue-500 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary" >
                            <FontAwesomeIcon icon={faCode} size="2x" className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-accent-DEFAULT mb-2">Teknologi Terdepan</h3>
                        <p className="leading-relaxed text-center">
                            Kami menggunakan teknologi virtualisasi dan orkestrasi kontainer terkini untuk memastikan fleksibilitas, skalabilitas, dan keamanan dalam penyediaan sumber daya GPU.
                        </p>
                    </div>
                </>
            )}
        </>
    );
};

export default TeamTechSection;