import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import AnimatedCounter from './AnimatedCounter';
import { ShimmerThumbnail } from 'react-shimmer-effects';

const VisitorCountSection = ({ loading: propLoading }) => {
    const [totalVisitorCount, setTotalVisitorCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [animationDuration, setAnimationDuration] = useState(2000); // Durasi default
    const [hasAnimated, setHasAnimated] = useState(false); // State untuk menandakan apakah animasi sudah berjalan
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTotalVisitors = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/user/visitors/total`);
                const data = await response.json();
                if (data && data.totalVisitors !== undefined) {
                    setTotalVisitorCount(data.totalVisitors);
                    const baseDuration = 3000;
                    const speedFactor = 10;
                    const calculatedDuration = Math.max(500, baseDuration - (data.totalVisitors / speedFactor));
                    setAnimationDuration(calculatedDuration);
                }
            } catch (error) {
                // console.error('Gagal mendapatkan total pengunjung:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalVisitors();
    }, []);

    // Kita tetap akan mencatat kunjungan saat komponen mount
    useEffect(() => {
        const recordVisit = async () => {
            try {
                await fetch(`${apiUrl}/api/user/visitors`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (error) {
                // console.error('Gagal mencatat kunjungan:', error);
            }
        };

        recordVisit();
    }, []);

    // Efek untuk menjalankan animasi hanya sekali setelah data loaded
    useEffect(() => {
        if (!loading && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [loading, hasAnimated]);

    return (
        <div className="grid grid-cols-1 gap-8 px-4 sm:px-8 md:px-16 lg:px-32 mb-12">
            <div className="bg-blue-500 rounded-xl shadow-md p-8 text-white flex flex-col items-center justify-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Total Pengunjung</h2>
                </div>
                <p className="text-white text-7xl font-bold mt-4">
                    {loading ? (
                        <ShimmerThumbnail width={150} height={50} rounded />
                    ) : (
                        <AnimatedCounter
                            to={totalVisitorCount}
                            duration={animationDuration}
                            isVisible={true} // Animasi selalu "visible" setelah data loaded pertama kali
                            shouldAnimate={!hasAnimated} // Kontrol apakah animasi harus berjalan
                        />
                    )}
                </p>
                <span className="text-lg mt-2">Total Pengunjung Situs</span>
            </div>
        </div>
    );
};

export default VisitorCountSection;