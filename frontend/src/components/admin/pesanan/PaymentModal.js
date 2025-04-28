import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';

const PaymentModal = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [containerScale, setContainerScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const modalContentRef = useRef(null);

    useEffect(() => {
        if (!imageUrl) {
            Swal.fire('Info', 'Bukti pembayaran belum diunggah.', 'info').then(() => {
                onClose();
            });
        }
    }, [imageUrl, onClose]);

    useEffect(() => {
        const adjustInitialScale = () => {
            if (imgRef.current && modalContentRef.current) {
                const imgWidth = imgRef.current.naturalWidth;
                const imgHeight = imgRef.current.naturalHeight;
                const modalWidth = modalContentRef.current.offsetWidth;
                const modalHeight = modalContentRef.current.offsetHeight - 60; // Subtract space for header (adjust as needed)

                const scaleX = modalWidth / imgWidth;
                const scaleY = modalHeight / imgHeight;
                const initialScale = Math.min(1, scaleX, scaleY);

                setContainerScale(initialScale);
                setScale(1);
                setPosition({ x: 0, y: 0 });
            }
        };

        const img = new Image();
        img.onload = adjustInitialScale;
        img.src = imageUrl;

        const resizeObserver = new ResizeObserver(adjustInitialScale);
        if (modalContentRef.current) {
            resizeObserver.observe(modalContentRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [imageUrl]);

    if (!imageUrl) {
        return null;
    }

    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${process.env.REACT_APP_API_URL}/${imageUrl}`;

    const handleWheel = (event) => {
        event.preventDefault();
        const delta = Math.max(-1, Math.min(1, event.deltaY));
        setScale(prevScale => Math.max(0.1, Math.min(3, prevScale - delta * 0.1)));
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - position.x, y: event.clientY - position.y });
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        setPosition({ x: event.clientX - startPosition.x, y: event.clientY - position.y });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-64 flex justify-center items-center z-50 backdrop-blur-md">
            <div ref={modalContentRef} className="bg-transparent rounded-lg shadow-xl max-w-3xl max-h-screen overflow-auto relative">
                {/* Header Modal */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={resetZoom}
                        className="inline-flex items-center justify-center p-2 border border-gray-300 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2"
                        title="Reset Zoom"
                    >
                        <ArrowsPointingOutIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="inline-flex items-center justify-center p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title="Tutup"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
                {/* Container Gambar */}
                <div
                    className="cursor-grab flex justify-center items-center overflow-hidden"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        width: '100%',
                        height: 'calc(100% - 60px)', // Subtract space for header
                    }}
                >
                    <img
                        ref={imgRef}
                        src={fullImageUrl}
                        alt="Bukti Pembayaran"
                        className="block"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${containerScale * scale})`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.1s ease-out',
                            maxWidth: 'none',
                            maxHeight: 'none',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;