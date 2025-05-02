import React, { useEffect, useState, useRef } from 'react';
import { useFadeInOnScroll } from '../../../hooks/useFadeInOnScrool';
import { CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 4;

const sortPackages = (packages, criteria) => {
    const sorted = [...packages];
    switch (criteria) {
        case 'price_asc':
            return sorted.sort((a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour));
        case 'price_desc':
            return sorted.sort((a, b) => parseFloat(b.price_per_hour) - parseFloat(a.price_per_hour));
        case 'ram_asc':
            return sorted.sort((a, b) => parseInt(a.ram) - parseInt(b.ram));
        case 'ram_desc':
            return sorted.sort((a, b) => parseInt(b.ram) - parseInt(a.ram));
        case 'vcpu_asc':
            return sorted.sort((a, b) => parseInt(a.vcpu) - parseInt(b.vcpu));
        case 'vcpu_desc':
            return sorted.sort((a, b) => parseInt(b.vcpu) - parseInt(a.vcpu));
        case 'period_asc':
            return sorted.sort((a, b) => parseInt(a.min_period_hours) - parseInt(b.min_period_hours));
        case 'period_desc':
            return sorted.sort((a, b) => parseInt(b.min_period_hours) - parseInt(a.min_period_hours));
        case 'updated_at_desc':
            return sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        case 'updated_at_asc':
            return sorted.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
        case 'created_at_desc': // Default
        default:
            return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        case 'created_at_asc':
            return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
};

const ProductCard = React.forwardRef((props, ref) => {
    const [gpuPackages, setGpuPackages] = useState([]);
    const [visiblePackages, setVisiblePackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreStep, setLoadMoreStep] = useState(4); // Default step
    const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE);
    const cardRefs = useRef([]);
    const [isCardVisible, setIsCardVisible] = useState([]);
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const [sortBy, setSortBy] = useState('created_at_desc');
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    // State untuk backoff pada fetch awal
    const [fetchRetryCount, setFetchRetryCount] = useState(0);
    const [fetchRetryDelay, setFetchRetryDelay] = useState(1000); // 1 detik awal

    // State untuk backoff pada load more
    const [loadMoreRetryCount, setLoadMoreRetryCount] = useState(0);
    const [loadMoreRetryDelay, setLoadMoreRetryDelay] = useState(1000); // 1 detik awal

    const handlePesanClick = (packageId) => {
        if (token) {
            navigate(`/form-pengisian?packageId=${packageId}`);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Anda Belum Login',
                text: 'Silakan login terlebih dahulu untuk melakukan pemesanan.',
                confirmButtonText: 'Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: location.pathname } }); // Kirim info halaman asal
                }
            });
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setIsFilterLoading(true);
        setTimeout(() => {
            setIsFilterLoading(false);
        }, 1000); // Simulasi loading filter
    };

    const handleLoadMoreStepChange = (event) => {
        setLoadMoreStep(parseInt(event.target.value));
        setLoadedCount(ITEMS_PER_PAGE); // Reset loaded count when step changes
        const sortedPackages = sortPackages(gpuPackages, sortBy);
        setVisiblePackages(sortedPackages.slice(0, ITEMS_PER_PAGE));
        if (sortedPackages.length > ITEMS_PER_PAGE) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
    };

    const fetchGpuPackages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/packages`);
            if (response.status === 429) {
                console.warn('Fetch GPU Packages: Menerima 429, mencoba lagi setelah', fetchRetryDelay);
                setTimeout(fetchGpuPackages, fetchRetryDelay);
                setFetchRetryDelay(prevDelay => prevDelay * 2);
                setFetchRetryCount(prevCount => prevCount + 1);
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGpuPackages(data);
            const sortedData = sortPackages(data, sortBy);
            setVisiblePackages(sortedData.slice(0, ITEMS_PER_PAGE));
            setLoadedCount(ITEMS_PER_PAGE);
            setShowMore(sortedData.length > ITEMS_PER_PAGE);
            cardRefs.current = sortedData.map(() => React.createRef());
            setIsCardVisible(sortedData.map(() => false));
            setLoading(false);
            setFetchRetryCount(0);
            setFetchRetryDelay(1000);
        } catch (e) {
            setError(e);
            setLoading(false);
            setFetchRetryCount(0);
            setFetchRetryDelay(1000);
        }
    };

    useEffect(() => {
        fetchGpuPackages();
    }, [sortBy]);

    

    useEffect(() => {
        const sortPackagesAndUpdateState = (packages, criteria) => {
            const sortedPackages = sortPackages(packages, criteria);
            setVisiblePackages(sortedPackages.slice(0, ITEMS_PER_PAGE));
            setLoadedCount(ITEMS_PER_PAGE);
            cardRefs.current = sortedPackages.map(() => React.createRef());
            setIsCardVisible(sortedPackages.map(() => false));
            setShowMore(sortedPackages.length > ITEMS_PER_PAGE);
        };

        if (gpuPackages.length > 0) {
            sortPackagesAndUpdateState(gpuPackages, sortBy);
        }
    }, [gpuPackages, sortBy]);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = cardRefs.current.findIndex(ref => ref.current === entry.target);
                    if (entry.isIntersecting && index !== -1 && !isCardVisible[index]) {
                        setIsCardVisible(prevVisible => {
                            const newVisible = [...prevVisible];
                            newVisible[index] = true;
                            return newVisible;
                        });
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        cardRefs.current.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, [cardRefs, isCardVisible]);

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            const sortedPackages = sortPackages(gpuPackages, sortBy);
            const nextCount = loadedCount + loadMoreStep;
            const nextPackages = sortedPackages.slice(0, nextCount);
            setVisiblePackages(nextPackages);
            setLoadedCount(nextCount);
            if (nextPackages.length >= gpuPackages.length) {
                setShowMore(false);
            }
            setLoadingMore(false);
        }, 1000); // Simulasi loading
    };


    if (loading) {
        return (
            <div className="text-center">
                <RocketLaunchIcon className="mr-2 h-4 w-4 animate-spin inline-block" />
                Memuat data GPU...
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Terjadi kesalahan saat memuat data: {error.message}</div>;
    }
    const handleReset = () => {
        setLoadedCount(ITEMS_PER_PAGE);
        setSortBy('created_at_desc'); // Reset urutan ke default
        const sortedPackages = sortPackages(gpuPackages, 'created_at_desc');
        setVisiblePackages(sortedPackages.slice(0, ITEMS_PER_PAGE));
        setShowMore(sortedPackages.length > ITEMS_PER_PAGE);
    };

    const handleLoadLess = () => {
        const newLoadedCount = Math.max(ITEMS_PER_PAGE, loadedCount - loadMoreStep);
        setVisiblePackages(sortPackages(gpuPackages, sortBy).slice(0, newLoadedCount));
        setLoadedCount(newLoadedCount);
        setShowMore(newLoadedCount < gpuPackages.length);
    };

    return (
        <>
            <div ref={ctaRef} className="text-center mb-6 transition-all duration-700 translate-y-6 opacity-5"
                style={{
                    transform: isCtaVisible ? 'translateY(0)' : '',
                    opacity: isCtaVisible ? 1 : 0
                }}>
                <h2 className="lg:text-5xl text-3xl  font-bold text-black">Produk dan Layanan Kami</h2>
                <p className="mt-2 text-gray-600 text-sm lg:text-xl">Jelajahi ragam layanan Teknologi Informasi dan Komunikasi inovatif dari kami untuk berbagai pilihan industri.</p>
            </div>
            <div ref={ctaRef} className="mb-4 flex justify-end items-center space-x-4 transition-all duration-700 translate-y-6 opacity-5"
                style={{
                    transform: isCtaVisible ? 'translateY(0)' : '',
                    opacity: isCtaVisible ? 1 : 0
                }}>
                <div>
                    <label htmlFor="loadStep" className="block text-sm font-medium text-gray-700">
                        Tampilkan
                    </label>
                    <div className="relative">
                        <select
                            id="loadStep"
                            className="block w-full pl-3 pr-10 py-2 bg-white text-gray-900 border border-primary-300 focus:outline-none focus:ring-primary focus:border-primary-500 sm:text-sm rounded-md shadow-sm appearance-none"
                            value={loadMoreStep}
                            onChange={handleLoadMoreStepChange}
                        >
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value={4}>4 Item</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value={8}>8 Item</option>
                            <option className="bg-w4 Itemhite hover:bg-gray-100 text-gray-900" value={16}>16 Item</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value={50}>50 Item</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value={100}>100 Item</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                        Urutkan
                    </label>
                    <div className="relative">
                        <select
                            id="sort"
                            className="block w-full pl-3 pr-10 py-2 bg-white text-gray-900 border border-primary-300 focus:outline-none focus:ring-primary focus:border-primary-500 sm:text-sm rounded-md shadow-sm appearance-none"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="created_at_desc">Terakhir Ditambahkan</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="created_at_asc">Terlama Ditambahkan</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="price_asc">Harga Termurah</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="price_desc">Harga Termahal</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="ram_asc">RAM Terendah</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="ram_desc">RAM Tertinggi</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="vcpu_asc">vCPU Terendah</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="vcpu_desc">vCPU Tertinggi</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="period_asc">Periode Terpendek</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="period_desc">Periode Terlama</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="updated_at_desc">Terakhir Diupdate</option>
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value="updated_at_asc">Terlama Diupdate</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={ctaRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8 px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
                {visiblePackages.map((gpu, index) => (
                    <div key={gpu.id}
                        ref={cardRefs.current[index]}
                        className={`bg-white rounded-lg shadow-md p-6 sm:p-6 lg:p-6 xl:p-8 transition-all duration-700 transform translate-y-6 opacity-0 `}
                        style={{
                            transform: isCtaVisible ? 'translateY(0)' : '',
                            opacity: isCtaVisible ? 1 : 0
                        }}>
                        <h3 className="text-primary-dark text-2xl sm:text-2xl lg:text-2xl xl:text-3xl font-semibold transition duration-300">{gpu.name.split(' ')[0]} GPU</h3>
                        <h2 className="text-md sm:text-md font-base mb-3 sm:mb-4 text-gray-700 lg:text-lg xl:text-lg">{gpu.name}</h2>
                        <div className='mb-2 sm:mb-3 flex items-center'>
                            <h1 className='text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-bold '>Rp{parseFloat(gpu.price_per_hour).toLocaleString('id-ID')}</h1>
                            <span className='block ml-2 text-xs sm:text-sm lg:text-sm xl:text-md'>/ per jam</span>
                        </div>
                        <div className="mb-1 flex items-center">
                            <CheckCircleIcon className="text-primary mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                            <span className="text-xs sm:text-sm lg:text-sm xl:text-md">Memory GPU {gpu.memory_gpu} </span>
                        </div>
                        <div className="mb-1 flex items-center">
                            <CheckCircleIcon className="text-primary mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                            <span className="text-xs sm:text-sm lg:text-sm xl:text-md">Hingga {gpu.vcpu}</span>
                        </div>
                        <div className="mb-1 flex items-center">
                            <CheckCircleIcon className="text-primary mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                            <span className="text-xs sm:text-sm lg:text-sm xl:text-md">RAM hingga {gpu.ram}</span>
                        </div>
                        <div className="mb-1 flex items-center">
                            <CheckCircleIcon className="text-primary mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                            <span className="text-xs sm:text-sm lg:text-sm xl:text-md">SSDK hingga {gpu.ssd}</span>
                        </div>
                        <div className="mb-3 sm:mb-3 flex items-center">
                            <CheckCircleIcon className="text-primary mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                            <span className="text-xs sm:text-sm lg:text-sm xl:text-md">Periode minimal {gpu.min_period_hours} Jam</span>
                        </div>
                        {gpu.description && <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 lg:text-sm xl:text-md">{gpu.description.substring(0, 80)}...</p>}
                        <div className="flex justify-center">
                            <button
                                onClick={() => handlePesanClick(gpu.id)}
                                className="bg-secondary text-white text-sm sm:text-lg lg:text-sm xl:text-lg font-bold py-2 px-3 sm:py-2 sm:px-4 rounded-full hover:bg-secondary-dark transition duration-300"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center space-x-4">
                {loadedCount > ITEMS_PER_PAGE && (
                    <button
                        onClick={handleLoadLess}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-full transition duration-300 text-sm"
                    >
                        Kurangi
                    </button>
                )}
                {gpuPackages.length > ITEMS_PER_PAGE && loadedCount >= gpuPackages.length && (
                    <button
                        onClick={handleReset}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm"
                    >
                        Reset Awal
                    </button>
                )}
                {showMore && (
                    <button
                        onClick={handleLoadMore}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm"
                        disabled={loadingMore}
                    >
                        {loadingMore ? (
                            <RocketLaunchIcon className="mr-2 h-4 w-4 animate-spin inline-block" />
                        ) : (
                            'Lihat Selengkapnya'
                        )}
                    </button>
                )}
            </div>
            {gpuPackages.length > 0 && loadedCount >= gpuPackages.length && !showMore && (
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm italic">Semua paket GPU telah ditampilkan.</p>
                </div>
            )}
        </>
    );
});

export default ProductCard;