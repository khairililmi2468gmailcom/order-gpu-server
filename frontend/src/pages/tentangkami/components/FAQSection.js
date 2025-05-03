import React, { useState } from 'react';
import AccordionItem from './AccordionItem';

const FAQSection = () => {
    const [accordionStates, setAccordionStates] = useState({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const toggleAccordion = (itemId, contentRef, iconRef) => {
        setAccordionStates(prevState => {
            const newState = {
                ...prevState,
                [itemId]: !prevState[itemId],
            };

            // Dapatkan elemen konten dan ikon yang sedang di-toggle
            const contentElement = contentRef.current;
            const iconElement = iconRef.current;

            if (contentElement) {
                if (newState[itemId]) {
                    contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
                    if (iconElement) {
                        iconElement.classList.remove('rotate-180');
                    }
                } else {
                    contentElement.style.maxHeight = '0';
                    if (iconElement) {
                        iconElement.classList.add('rotate-180');
                    }
                }
            }

            // Tutup item accordion lainnya jika perlu (opsional)
            // for (const key in newState) {
            //     if (key !== itemId.toString() && newState[key]) {
            //         const otherContent = document.getElementById(`accordion-color-body-${key}`);
            //         const otherIcon = document.querySelector(`#accordion-color-heading-${key} svg`);
            //         if (otherContent) {
            //             otherContent.style.maxHeight = '0';
            //         }
            //         if (otherIcon) {
            //             otherIcon.classList.add('rotate-180');
            //         }
            //         newState[key] = false;
            //     }
            // }

            return newState;
        });
    };

    return (
        <div className="mt-16 px-4 sm:px-8 md:px-16 lg:px-32">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Pertanyaan Umum</h2>
            <div id="accordion-color" data-accordion="collapse" data-active-classes="bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white">
                <AccordionItem
                    id="1"
                    title="Apa itu Penyewaan GPU?"
                    isOpen={accordionStates[1]}
                    toggleAccordion={toggleAccordion}
                >
                    Layanan penyewaan GPU memungkinkan Anda untuk mengakses sumber daya komputasi grafis yang kuat secara fleksibel tanpa perlu investasi perangkat keras yang mahal.
                </AccordionItem>
                <AccordionItem
                    id="2"
                    title="Bagaimana Cara Memulai?"
                    isOpen={accordionStates[2]}
                    toggleAccordion={toggleAccordion}
                >
                    Anda dapat memulai dengan membuat akun, memilih paket GPU yang sesuai dengan kebutuhan Anda, dan melakukan pembayaran. Tim kami akan membantu Anda dengan proses selanjutnya.
                </AccordionItem>
                <AccordionItem
                    id="3"
                    title="Apa Keuntungan Menyewa GPU?"
                    isOpen={accordionStates[3]}
                    toggleAccordion={toggleAccordion}
                >
                    Menyewa GPU lebih hemat biaya, memberikan fleksibilitas dalam skala komputasi, dan menghilangkan kebutuhan pemeliharaan perangkat keras.
                </AccordionItem>
                <AccordionItem
                    id="4"
                    title="GPU Apa Saja yang Tersedia?"
                    isOpen={accordionStates[4]}
                    toggleAccordion={toggleAccordion}
                >
                    Kami menyediakan berbagai jenis GPU, termasuk NVIDIA Tesla, RTX, dan lainnya.
                </AccordionItem>
                <AccordionItem
                    id="5"
                    title="Apakah Ada Dukungan Teknis?"
                    isOpen={accordionStates[5]}
                    toggleAccordion={toggleAccordion}
                >
                    Ya, tim dukungan teknis kami siap membantu Anda 24/7 untuk menjawab pertanyaan dan mengatasi masalah yang mungkin Anda hadapi.
                </AccordionItem>
            </div>
        </div>
    );
};

export default FAQSection;