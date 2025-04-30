import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faHistory } from '@fortawesome/free-solid-svg-icons';
import { ShimmerThumbnail, ShimmerTitle } from 'react-shimmer-effects';

const VisionMissionSection = ({ loading }) => {
    return (
        <>
            {loading ? (
                <>
                    <div className="bg-gray-100 rounded-xl shadow-md p-8 border-b-4 border-gray-300 flex flex-col items-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faBuilding} size="2x" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                    <div className="bg-gray-100 rounded-xl shadow-md p-8 border-b-4 border-gray-300 flex flex-col items-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faHistory} size="2x" className="text-gray-500" />
                        </div>
                        <ShimmerTitle line={1} variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2 w-1/2" rounded variant="secondary" />
                    </div>
                </>
            ) : (
                <>
                    {/* Visi */}
                    <div className="bg-white rounded-xl shadow-xl hover:border p-8 text-gray-800 border-b-4 border-primary flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-primary" >
                            <FontAwesomeIcon icon={faBuilding} size="2x" className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">Visi Kami</h3>
                        <p className="leading-relaxed text-center">
                            Menjadi platform penyewaan GPU terdepan yang menyediakan akses mudah dan terpercaya ke sumber daya komputasi tinggi untuk riset, pengembangan, dan inovasi.
                        </p>
                    </div>

                    {/* Misi */}
                    <div className="bg-white rounded-xl shadow-xl hover:border p-8 text-gray-800 border-b-4 border-blue-500 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-blue-500" >
                            <FontAwesomeIcon icon={faHistory} size="2x" className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-accent-DEFAULT mb-2">Misi Kami</h3>
                        <ul className="list-disc pl-5 leading-relaxed text-gray-600 text-left">
                            <li>Menyediakan infrastruktur GPU yang andal dan berperforma tinggi.</li>
                            <li>Menawarkan berbagai pilihan GPU yang sesuai dengan kebutuhan pengguna.</li>
                            <li>Memastikan pengalaman penyewaan yang mudah, cepat, dan aman.</li>
                            <li>Mendukung komunitas riset dan pengembangan dengan sumber daya komputasi yang terjangkau.</li>
                        </ul>
                    </div>
                </>
            )}
        </>
    );
};

export default VisionMissionSection;