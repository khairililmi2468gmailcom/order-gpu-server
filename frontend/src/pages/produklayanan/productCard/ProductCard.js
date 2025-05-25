import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFadeInOnScroll } from '../../../hooks/useFadeInOnScrool';
import { CheckCircleIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 4; // Initial items to display

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

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const ProductCard = React.forwardRef((props, ref) => {
    // Stores ALL GPU packages fetched from the API
    const [allGpuPackages, setAllGpuPackages] = useState([]);
    // Stores the packages currently visible to the user (a subset of allGpuPackages)
    const [displayedPackages, setDisplayedPackages] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Menggunakan objek untuk melacak setiap ID GPU

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMoreButton, setShowMoreButton] = useState(false); // Renamed for clarity
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreStep, setLoadMoreStep] = useState(ITEMS_PER_PAGE);
    const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE);

    const cardRefs = useRef([]); // To hold refs for individual product cards
    const [isCardVisible, setIsCardVisible] = useState([]); // To manage visibility for fade-in effect
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 }); // For the section's overall fade-in

    const [sortBy, setSortBy] = useState('created_at_desc');
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const debouncedSortBy = useDebounce(sortBy, 500);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    // State for backoff on initial fetch
    const [fetchRetryCount, setFetchRetryCount] = useState(0);
    const [fetchRetryDelay, setFetchRetryDelay] = useState(1000);

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
                    navigate('/login', { state: { from: location.pathname } });
                }
            });
        }
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setIsFilterLoading(true);
        // Simulate loading to provide user feedback during debounce period
        setTimeout(() => {
            setIsFilterLoading(false);
        }, 500);
    };

    const handleLoadMoreStepChange = (event) => {
        const newStep = parseInt(event.target.value, 10);
        setLoadMoreStep(newStep);
        setLoadedCount(ITEMS_PER_PAGE); // Reset displayed count to initial whenever step changes
        // Re-apply sorting and slice based on new step and initial count
        const sortedPackages = sortPackages(allGpuPackages, sortBy);
        setDisplayedPackages(sortedPackages.slice(0, ITEMS_PER_PAGE));
        setShowMoreButton(sortedPackages.length > ITEMS_PER_PAGE);
    };

    // --- Primary Data Fetching (runs ONLY ONCE on component mount) ---
    const fetchAllGpuPackages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/packages`);
            if (response.status === 429) {
                console.warn('Fetch GPU Packages: Menerima 429, mencoba lagi setelah', fetchRetryDelay);
                if (fetchRetryCount < 5) { // Limit retry attempts to prevent infinite loops
                    setTimeout(fetchAllGpuPackages, fetchRetryDelay);
                    setFetchRetryDelay(prevDelay => prevDelay * 2); // Exponential backoff
                    setFetchRetryCount(prevCount => prevCount + 1);
                } else {
                    throw new Error('Too many retries for 429 error. Please try again later.');
                }
                return; // Stop execution if 429 and retrying
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAllGpuPackages(data); // Store all fetched packages
            setLoading(false);
            setFetchRetryCount(0); // Reset retry state on successful fetch
            setFetchRetryDelay(1000); // Reset delay on successful fetch
        } catch (e) {
            setError(e);
            setLoading(false);
            setFetchRetryCount(0); // Reset retry state on error
            setFetchRetryDelay(1000); // Reset delay on error
        }
    }, [fetchRetryCount, fetchRetryDelay]); // `useCallback` dependencies for retry logic

    // Effect to run `WorkspaceAllGpuPackages` only once on mount
    useEffect(() => {
        fetchAllGpuPackages();
    }, [fetchAllGpuPackages]);

    // --- Effect for Sorting and Displaying (runs when data, sort criteria, or loadedCount changes) ---
    useEffect(() => {
        if (allGpuPackages.length > 0 || !loading) { // Ensure data is available or loading has finished
            const sortedData = sortPackages(allGpuPackages, debouncedSortBy);
            setDisplayedPackages(sortedData.slice(0, loadedCount));
            setShowMoreButton(sortedData.length > loadedCount);

            // Re-initialize cardRefs and visibility states for new data/order
            cardRefs.current = sortedData.map(() => React.createRef());
            setIsCardVisible(sortedData.map(() => false));
        }
    }, [allGpuPackages, debouncedSortBy, loadedCount, loading]);

    // --- Load More Logic (client-side only) ---
    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => { // Simulate network delay for better UX, remove if not needed
            const sortedData = sortPackages(allGpuPackages, sortBy); // Re-sort just in case state is out of sync
            const nextCount = loadedCount + loadMoreStep;
            const nextPackages = sortedData.slice(0, nextCount);
            setDisplayedPackages(nextPackages);
            setLoadedCount(nextCount);
            setShowMoreButton(nextPackages.length < allGpuPackages.length); // Check against allGpuPackages
            setLoadingMore(false);
        }, 300); // Small delay to show "Loading More..."
    };

    const handleLoadLess = () => {
        const newLoadedCount = Math.max(ITEMS_PER_PAGE, loadedCount - loadMoreStep);
        const sortedData = sortPackages(allGpuPackages, sortBy);
        setDisplayedPackages(sortedData.slice(0, newLoadedCount));
        setLoadedCount(newLoadedCount);
        setShowMoreButton(newLoadedCount < allGpuPackages.length);
    };

    const handleReset = () => {
        setLoadedCount(ITEMS_PER_PAGE); // Reset count
        setSortBy('created_at_desc'); // Reset sort order to default
        // The useEffect for sorting/displaying will pick this up
    };

    // --- Intersection Observer for Card Visibility (for fade-in animations) ---
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

        return () => {
            // Clean up observer when component unmounts or displayedPackages change
            if (observer) {
                observer.disconnect();
            }
        };
    }, [displayedPackages, isCardVisible]); // Re-run when displayed packages change (e.g., sorting, load more)

    if (loading) {
        return (
            <div className="text-center py-8">
                <RocketLaunchIcon className="mr-2 h-6 w-6 animate-spin inline-block text-primary-500" />
                <p className="text-lg text-gray-700">Memuat data GPU...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Terjadi kesalahan saat memuat data: {error.message}</div>;
    }

    const toggleDescription = (gpuId) => {
        setExpandedDescriptions(prevState => ({
            ...prevState,
            [gpuId]: !prevState[gpuId] // Toggle status untuk GPU spesifik ini
        }));
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
                            <option className="bg-white hover:bg-gray-100 text-gray-900" value={16}>16 Item</option>
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
            <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8 px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
                {displayedPackages.map((gpu, index) => (
                    <div key={gpu.id}
                        ref={cardRefs.current[index]}
                        className={`bg-white rounded-lg shadow-md p-6 sm:p-6 lg:p-6 xl:p-8 transition-all duration-700 transform ${isCardVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    >
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
                        <div className="mb-3 sm:mb-3 flex items-center">
                            {gpu.stock_available > 0 ? (
                                <>
                                    <CheckCircleIcon className="text-green-500 mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" />
                                    <span className="text-xs sm:text-sm lg:text-sm xl:text-md font-semibold text-green-700">
                                        Stok Tersedia: {gpu.stock_available}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <svg className="text-red-500 mr-2 h-5 w-5 sm:h-5 lg:h-6 xl:h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                    <span className="text-xs sm:text-sm lg:text-sm xl:text-md font-semibold text-red-700">
                                        Stok Habis
                                    </span>
                                </>
                            )}
                        </div>
                        {gpu.description && (
                            <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 lg:text-sm xl:text-md">
                                {/* Menggunakan expandedDescriptions[gpu.id] untuk menentukan apakah deskripsi penuh ditampilkan */}
                                {expandedDescriptions[gpu.id] ? gpu.description : `${gpu.description.substring(0, 80)}...`}
                                {/* Pastikan panjang deskripsi lebih dari 80 karakter (sesuai dengan substring) */}
                                {gpu.description.length > 80 && (
                                    <span
                                        className="cursor-pointer text-blue-500 hover:text-blue-700 ml-1"
                                        onClick={() => toggleDescription(gpu.id)} // Meneruskan ID GPU ke fungsi
                                        title={expandedDescriptions[gpu.id] ? "Sembunyikan" : "Lihat selengkapnya"}
                                    >
                                        {expandedDescriptions[gpu.id] ? (
                                            ' Sembunyikan'
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                        )}
                                    </span>
                                )}
                            </p>
                        )}
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
                {allGpuPackages.length > ITEMS_PER_PAGE && loadedCount >= allGpuPackages.length && (
                    <button
                        onClick={handleReset}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 text-sm"
                    >
                        Reset Awal
                    </button>
                )}
                {showMoreButton && ( // Use showMoreButton state
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
            {allGpuPackages.length > 0 && loadedCount >= allGpuPackages.length && !showMoreButton && (
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm italic">Semua paket GPU telah ditampilkan.</p>
                </div>
            )}
        </>
    );
});

export default ProductCard;