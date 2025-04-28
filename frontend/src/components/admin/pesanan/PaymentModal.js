import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';

const PaymentModal = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
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
                const modalWidth = modalContentRef.current.offsetWidth * 0.8; // Adjust as needed
                const modalHeight = modalContentRef.current.offsetHeight * 0.8; // Adjust as needed

                const scaleX = modalWidth / imgWidth;
                const scaleY = modalHeight / imgHeight;
                const initialScale = Math.min(1, scaleX, scaleY); // Start with a scale that fits within the modal

                setScale(initialScale);
                setPosition({ x: 0, y: 0 }); // Reset position on image load
            }
        };

        // Adjust initial scale when the image loads
        const img = new Image();
        img.onload = adjustInitialScale;
        img.src = imageUrl;

        // Also adjust if the modal content size changes (e.g., due to scrollbar)
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
        setScale(prevScale => Math.max(0.1, Math.min(3, prevScale - delta * 0.1))); // Adjusted zoom sensitivity and limits
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - position.x, y: event.clientY - position.y });
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        setPosition({ x: event.clientX - startPosition.x, y: event.clientY - startPosition.y });
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
    const zoomIn = () => {
        setScale(prevScale => Math.min(3, prevScale + 0.2));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(0.1, prevScale - 0.2));
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-md"> {/* Tambahkan backdrop-blur */}
            <div ref={modalContentRef} className="bg-white rounded-lg shadow-xl p-8 max-w-3xl max-h-screen overflow-auto relative"> {/* Tambahkan shadow */}
                <div
                    className="relative cursor-grab flex justify-center items-center"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.1s ease-out',
                        minWidth: '100%',
                        minHeight: '100%',
                    }}
                >
                    <img
                        ref={imgRef}
                        src={fullImageUrl}
                        alt="Bukti Pembayaran"
                        className="block max-w-full max-h-full object-contain"
                        style={{ maxWidth: 'unset', maxHeight: 'unset' }} // Allow image to scale freely within its container
                    />
                </div>
                <div className="absolute top-4 right-4 space-x-2">
                    <button
                        onClick={resetZoom}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-500 hover:bg-gray-100 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Reset Zoom
                    </button>
                    <button
                        className="inline-flex items-center px-4 py-2 bg-indigo-500 border border-transparent font-semibold rounded-md text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PaymentModal;