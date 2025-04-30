import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AccordionItem = ({ id, title, children, isOpen, toggleAccordion }) => {
    const headingId = `accordion-color-heading-${id}`;
    const bodyId = `accordion-color-body-${id}`;
    const contentRef = useRef(null);
    const iconRef = useRef(null);

    // SVG untuk Down icon (sesuaikan dengan FontAwesome)
    const downIcon = <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />;

    // SVG untuk Up icon (sesuaikan dengan FontAwesome, rotate 180)
    const upIcon = <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 rotate-180" />;


    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                contentRef.current.style.visibility = 'visible';
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight + 20}px`; // Tambahkan 20px (atau nilai lain)
            } else {
                contentRef.current.style.maxHeight = '0px';
                const timer = setTimeout(() => {
                    if (!isOpen && contentRef.current) {
                        contentRef.current.style.visibility = 'hidden';
                    }
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen]);
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <h2 id={headingId}>
                <button
                    type="button"
                    className={`w-full flex justify-between items-center p-4 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3 ${isOpen ? 'bg-blue-100 text-blue-600 dark:bg-gray-800 dark:text-white border-b border-blue-200 dark:border-gray-700 rounded-t-xl' : 'rounded-xl'}`}
                    data-accordion-target={`#${bodyId}`}
                    aria-expanded={isOpen}
                    aria-controls={bodyId}
                    onClick={() => toggleAccordion(id, contentRef, iconRef)}
                >
                    <span className="text-left">{title}</span>
                    <span ref={iconRef} className={`text-slate-800 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}>
                        {downIcon}
                    </span>
                </button>
            </h2>
            <div
                ref={contentRef}
                id={bodyId}
                className={`overflow-hidden transition-all duration-300 ease-in-out`}
                style={{ maxHeight: '0', padding: isOpen ? '1rem' : '0', visibility: isOpen ? 'visible' : 'hidden' }}
            >
                <div className="text-sm text-slate-500 py-2"> {/* Tambahkan padding bawah */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;