import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { RocketLaunchIcon, CheckCircleIcon, InformationCircleIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const FormPengisian = () => {
    const [searchParams] = useSearchParams();
    const [packageId, setPackageId] = useState('');
    const [gpuPackage, setGpuPackage] = useState(null);
    const [durationDays, setDurationDays] = useState('');
    const [orderResult, setOrderResult] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [paymentProof, setPaymentProof] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [durationError, setDurationError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isUploadFormVisible, setIsUploadFormVisible] = useState(false);
    const [paymentProofPreview, setPaymentProofPreview] = useState(null);
    const [isPackageLoading, setIsPackageLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [orderCreated, setOrderCreated] = useState(false);

    useEffect(() => {
        const id = searchParams.get('packageId');
        if (id) {
            setPackageId(id);
            fetchGpuPackageDetails(id);
        } else {
            navigate('/semua-layanan');
        }

        const storedDuration = localStorage.getItem('durationDays');
        if (storedDuration) {
            setDurationDays(storedDuration);
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        if (gpuPackage?.min_period_days && !localStorage.getItem('durationDays') && !durationDays) {
            setDurationDays(String(gpuPackage.min_period_days));
        }
    }, [gpuPackage?.min_period_days, durationDays]);

    useEffect(() => {
        localStorage.setItem('durationDays', durationDays);
    }, [durationDays]);

    useEffect(() => {
        if (orderResult?.orderId) {
            setCurrentStep(3);
            setOrderCreated(true);
        }
    }, [orderResult]);

    const fetchGpuPackageDetails = async (id) => {
        setIsPackageLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/packages/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGpuPackage(data);
        } catch (error) {
            console.error('Error fetching GPU package details:', error);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Gagal mengambil detail paket.' });
            navigate('/semua-layanan');
        } finally {
            setIsPackageLoading(false);
        }
    };

    const handleSelanjutnyaStep1 = () => {
        if (!durationDays || parseInt(durationDays) < gpuPackage?.min_period_days) {
            setDurationError(`Durasi harus minimal ${gpuPackage?.min_period_days} hari.`);
            return;
        }
        setDurationError('');
        setCurrentStep(2);
    };

    const handleOrderConfirmation = () => {
        const isDurationValidOnBackend = parseInt(durationDays) >= gpuPackage?.min_period_days;

        if (!isDurationValidOnBackend) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Pesanan',
                text: `Durasi yang Anda pilih tidak valid. Silakan pilih durasi minimal ${gpuPackage?.min_period_days} hari.`,
            }).then(() => {
                setCurrentStep(1);
            });
            return;
        }

        Swal.fire({
            title: 'Konfirmasi Pesanan',
            text: `Apakah Anda yakin ingin membuat pesanan untuk paket ${gpuPackage?.name} dengan durasi ${durationDays} hari?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Buat Pesanan!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                handleOrderSubmit();
            }
        });
    };

    const handleOrderSubmit = async () => {
        setLoadingOrder(true);
        setOrderResult(null);
        setDurationError('');
        setIsUploadFormVisible(false);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    gpu_package_id: parseInt(packageId),
                    duration_days: parseInt(durationDays),
                }),
            });

            const isOk = response.ok;
            const data = await response.json();

            setLoadingOrder(false);

            if (!isOk) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Membuat Pesanan',
                    text: data.message || 'Terjadi kesalahan saat membuat pesanan.',
                });
                return;
            }

            setOrderResult(data);
            Swal.fire({
                icon: 'success',
                title: 'Pesanan Dibuat!',
                text: 'Silakan lakukan pembayaran.',
                showConfirmButton: true,
            }).then(() => {
                setCurrentStep(3);
                setOrderCreated(true);
            });
        } catch (error) {
            console.error('Error creating order:', error);
            setLoadingOrder(false);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Terjadi kesalahan jaringan saat membuat pesanan.' });
        }
    };

    const handlePaymentProofChange = (e) => {
        const file = e.target.files[0];
        setPaymentProof(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProofPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPaymentProofPreview(null);
        }
    };

    const handleUploadConfirmation = () => {
        Swal.fire({
            title: 'Konfirmasi Upload',
            text: 'Apakah Anda yakin ingin mengirim bukti pembayaran ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Kirim!',
            cancelButtonText: 'Batal',
            imageUrl: paymentProofPreview,
            imageAlt: 'Preview Bukti Pembayaran',
        }).then((result) => {
            if (result.isConfirmed) {
                handleUploadPayment();
            }
        });
    };

    const handleUploadPayment = async () => {
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('paymentProof', paymentProof);
        formData.append('order_id', orderResult.orderId);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/orders/payment-proof`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            setUploadLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Bukti pembayaran anda sudah terkirim, tunggu notifikasi dari kami.',
            }).then(() => {
                setCurrentStep(4);
            });
        } catch (error) {
            console.error('Error uploading payment proof:', error);
            setUploadLoading(false);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Terjadi kesalahan saat mengunggah bukti pembayaran.' });
        }
    };

    const handleKembali = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const goToStep = (stepNumber) => {
        if (stepNumber <= currentStep) {
            setCurrentStep(stepNumber);
        }
    };

    const steps = [
        { id: 1, title: 'Pilih Durasi', description: 'Tentukan lama sewa paket' },
        { id: 2, title: 'Konfirmasi Pesanan', description: 'Periksa detail pesanan Anda' },
        { id: 3, title: 'Upload Pembayaran', description: 'Unggah bukti pembayaran' },
        { id: 4, title: 'Selesai', description: 'Pesanan Anda diproses' },
    ];

    const getStepIcon = (id) => {
        if (id < currentStep) {
            return (
                <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
            );
        } else if (id === currentStep) {
            return (
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.707-8.293a1 1 0 0 1-1.414 0L9 10.586 7.707 9.293a1 1 0 0 1-1.414 1.414l2 2a1 1 0 0 1 1.414 0l4-4a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm1-11a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V7Z" clipRule="evenodd" />
                </svg>
            );
        }
    };

    return (
        <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Formulir Pemesanan</h2>
            <div className="md:flex">
                <div className="w-full md:w-1/3 pr-8">
                    <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400">
                        {steps.map((step) => (
                            <li key={step.id} className={`mb-8 ms-6 ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-default text-gray-400 dark:text-gray-600'}`} onClick={() => goToStep(step.id)}>
                                <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 ${step.id < currentStep ? 'bg-green-200 dark:bg-green-900' : (step.id === currentStep ? 'bg-blue-200 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700')}`}>
                                    {getStepIcon(step.id)}
                                </span>
                                <h3 className={`font-semibold leading-tight ${step.id <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{step.title}</h3>
                                <p className="text-sm">{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="w-full md:w-2/3">
                    <div className="bg-white rounded-md shadow-md border border-gray-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {steps.find(step => step.id === currentStep)?.title}
                                </h3>
                                <button
                                    onClick={handleKembali}
                                    className="inline-flex items-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-300"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                                    </svg>
                                    Kembali
                                </button>
                            </div>

                            {currentStep === 1 && (
                                <div className="shadow-md rounded-md p-4 border border-gray-200 bg-gray-50">
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Pilih Durasi Sewa</h4>
                                    <div className="mb-3 flex items-center">
                                        <label htmlFor="durationDays" className="w-1/3 text-gray-600 font-semibold">Durasi (hari):</label>
                                        <input
                                            type="number"
                                            id="durationDays"
                                            className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 focus:border-blue-500"
                                            value={durationDays}
                                            onChange={(e) => setDurationDays(e.target.value)}
                                            min={gpuPackage?.min_period_days}
                                            required
                                            placeholder={`Minimal ${gpuPackage?.min_period_days} hari`}
                                        />
                                    </div>
                                    {durationError && <p className="text-red-500 text-sm italic mt-1">{durationError}</p>}
                                    <div className="mt-1">
                                        <p className="text-gray-600 text-sm">Masukkan jumlah hari. Minimal adalah {gpuPackage?.min_period_days} hari.</p>
                                    </div>
                                    <button
                                        onClick={handleSelanjutnyaStep1}
                                        className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-md transition duration-300 mt-4"
                                        disabled={!durationDays || parseInt(durationDays) < gpuPackage?.min_period_days}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="shadow-md rounded-md p-4 border border-gray-200 bg-gray-50">
                                    <h4 className="text-md font-semibold text-gray-700 mb-3">Konfirmasi Pesanan</h4>
                                    <div className="space-y-2">
                                        <p className="text-gray-700"><span className="font-semibold">Nama Paket:</span> {gpuPackage?.name}</p>
                                        <p className="text-gray-700"><span className="font-semibold">Durasi Sewa:</span> {durationDays} hari</p>
                                        {/* Tambahkan detail pesanan lain jika perlu */}
                                    </div>
                                    {orderCreated ? (
                                        <button
                                            onClick={() => setCurrentStep(3)}
                                            className="inline-flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-md transition duration-300 mt-4"
                                        >
                                            Lanjutkan ke Upload Pembayaran
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleOrderConfirmation}
                                            className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-md transition duration-300 mt-4"
                                            disabled={loadingOrder}
                                        >
                                            <RocketLaunchIcon className="mr-2 h-5 w-5" />
                                            {loadingOrder ? 'Memesan...' : 'Buat Pesanan'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {currentStep === 3 && orderResult?.orderId && (
                                <div className="shadow-md rounded-md p-4 border border-gray-200 bg-gray-50">
                                    <p className="mb-3 text-gray-600">Silakan upload bukti pembayaran untuk pesanan Anda.</p>
                                    <form className="mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                                                    <svg className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold">Klik untuk upload</span></p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">(PNG, JPG)</p>
                                                </div>
                                                <input id="dropzone-file" type="file" className="hidden" onChange={handlePaymentProofChange} required />
                                            </label>
                                            {paymentProofPreview && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
                                                    <img src={paymentProofPreview} alt="Preview Bukti Pembayaran" className="max-h-32 rounded-md shadow-sm" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleUploadConfirmation}
                                            className="inline-flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-md transition duration-300"
                                            disabled={uploadLoading || !orderResult?.orderId || !paymentProof}
                                        >
                                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                                            </svg>
                                            {uploadLoading ? 'Mengirim...' : 'Kirim Bukti'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {currentStep === 4 && orderResult?.orderId && paymentProof && (
                                <div className="shadow-md rounded-md p-4 border border-gray-200 bg-green-100 text-green-700">
                                    <div className="flex items-center mb-3">
                                        <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                                        <h3 className="font-semibold text-lg">Pesanan Selesai!</h3>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-700"><span className="font-semibold">Paket:</span> {gpuPackage?.name}</p>
                                        <p className="text-gray-700"><span className="font-semibold">Durasi:</span> {durationDays} hari</p>
                                        <p className="text-gray-700"><span className="font-semibold">ID Pesanan:</span> {orderResult?.orderId}</p>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <InformationCircleIcon className="w-6 h-6 mr-2 text-blue-500" />
                                        <p className="text-sm text-gray-600">Paket Anda akan segera diproses. Token akses akan dikirimkan melalui email setelah verifikasi.</p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/listorders')}
                                        className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline shadow-md transition duration-300"
                                    >
                                        <ListBulletIcon className="mr-2 h-5 w-5" />
                                        Lihat Daftar Pesanan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPengisian;