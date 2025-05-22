import React, { useEffect, useState, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';

const PaymentModal = ({ imageUrl, onClose }) => {
    // All React Hooks must be declared at the top level, unconditionally
    const [scale, setScale] = useState(1);
    const [containerScale, setContainerScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startOffset, setStartOffset] = useState({ x: 0, y: 0 }); // Stores offset from mouse to image origin
    const imgRef = useRef(null);
    const modalContentRef = useRef(null);

    // --- Mouse Event Handlers ---
    const handleWheel = useCallback((event) => {
        event.preventDefault(); // Prevent page scrolling
        const delta = Math.max(-1, Math.min(1, event.deltaY)); // Normalize scroll delta
        setScale(prevScale => Math.max(0.1, Math.min(3, prevScale - delta * 0.1))); // Adjust scale within limits
    }, []);

    const handleMouseDown = useCallback((event) => {
        setIsDragging(true);
        // Store the offset from the mouse pointer to the image's current position
        setStartOffset({ x: event.clientX - position.x, y: event.clientY - position.y });
    }, [position]);

    const handleMouseMove = useCallback((event) => {
        if (!isDragging) return;
        // Calculate new position based on current mouse position and stored offset
        setPosition({ x: event.clientX - startOffset.x, y: event.clientY - startOffset.y });
    }, [isDragging, startOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        // Stop dragging if mouse leaves the modal area
        setIsDragging(false);
    }, []);

    // --- Touch Event Handlers ---
    const handleTouchStart = useCallback((event) => {
        if (event.touches.length === 1) { // Only drag with one finger
            setIsDragging(true);
            setStartOffset({ x: event.touches[0].clientX - position.x, y: event.touches[0].clientY - position.y });
        }
    }, [position]);

    const handleTouchMove = useCallback((event) => {
        if (!isDragging || event.touches.length !== 1) return; // Only move if dragging and one finger
        event.preventDefault(); // Prevent scrolling on touch devices
        setPosition({ x: event.touches[0].clientX - startOffset.x, y: event.touches[0].clientY - startOffset.y });
    }, [isDragging, startOffset]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchCancel = useCallback(() => {
        setIsDragging(false);
    }, []);

    const resetZoom = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    // Effect to handle initial image loading and scaling
    useEffect(() => {
        // This check is now inside useEffect, so the hook call order is preserved
        if (!imageUrl) {
            Swal.fire('Info', 'Bukti pembayaran belum diunggah.', 'info').then(() => {
                onClose();
            });
            return; // Exit early if no image URL
        }

        const adjustInitialScale = () => {
            if (imgRef.current && modalContentRef.current) {
                const imgWidth = imgRef.current.naturalWidth;
                const imgHeight = imgRef.current.naturalHeight;
                // Get modal content dimensions
                const modalWidth = modalContentRef.current.offsetWidth;
                const modalHeight = modalContentRef.current.offsetHeight - 60; // Subtract space for header

                // Calculate scale to fit image within modal
                const scaleX = modalWidth / imgWidth;
                const scaleY = modalHeight / imgHeight;
                const initialScale = Math.min(1, scaleX, scaleY); // Don't scale up if image is smaller

                setContainerScale(initialScale);
                setScale(1); // Reset user's zoom scale
                setPosition({ x: 0, y: 0 }); // Reset position
            }
        };

        const img = new Image();
        img.onload = adjustInitialScale;
        img.src = imageUrl;

        // Observe modal content for resize to adjust image scale
        const resizeObserver = new ResizeObserver(adjustInitialScale);
        if (modalContentRef.current) {
            resizeObserver.observe(modalContentRef.current);
        }

        return () => {
            // Cleanup observer on component unmount
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [imageUrl, onClose]); // Re-run when imageUrl or onClose changes

    // Conditional rendering should happen AFTER all hooks are called
    if (!imageUrl) {
        return null;
    }

    // Construct full image URL
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${process.env.REACT_APP_API_URL}/${imageUrl}`;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-64 flex justify-center items-center z-50 backdrop-blur-md">
            <div ref={modalContentRef} className="bg-transparent rounded-lg shadow-xl max-w-3xl max-h-screen overflow-hidden relative">
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
                {/* Image Container */}
                <div
                    className="flex justify-center items-center overflow-hidden" // Removed cursor-grab from className
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    style={{
                        width: '100%',
                        height: 'calc(100% - 60px)', // Subtract space for header
                        // Added user-select: none to prevent text selection during dragging
                        userSelect: 'none', 
                        WebkitUserSelect: 'none', // For Webkit browsers
                        MozUserSelect: 'none', // For Mozilla Firefox
                        msUserSelect: 'none', // For Internet Explorer/Edge
                        touchAction: 'none', // Prevents default touch actions like scrolling/zooming
                        cursor: isDragging ? 'grabbing' : 'grab', // Dynamic cursor
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
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out', // Remove transition during dragging for smoothness
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
