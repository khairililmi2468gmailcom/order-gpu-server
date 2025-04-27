import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const PaymentModal = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!imageUrl) {
            Swal.fire('Info', 'Bukti pembayaran belum diunggah.', 'info').then(() => {
                onClose();
            });
        }
    }, [imageUrl, onClose]);

    if (!imageUrl) {
        return null;
    }

    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/</span>{imageUrl}`;

    const handleWheel = (event) => {
        event.preventDefault();
        const delta = Math.max(-1, Math.min(1, event.deltaY));
        setScale(prevScale => Math.max(0.5, Math.min(2, prevScale + delta * 0.1))); // Fixed typo here
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

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-3xl max-h-screen overflow-auto relative">
                <div
                    className="relative cursor-grab"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.1s ease-out',
                    }}
                >
                    <img
                        src={fullImageUrl}
                        alt="Bukti Pembayaran"
                        className="block max-w-full max-h-full object-contain"
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
