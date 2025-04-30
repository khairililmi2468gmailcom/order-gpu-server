import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { faBell, faChevronLeft, faCheckCircle, faHeart, faUsers, faFileAlt, faExclamationTriangle, faShippingFast } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';

const getIconForNotification = (type) => {
    switch (type) {
        case 'favourite':
            return faHeart;
        case 'group_add':
            return faUsers;
        case 'post':
            return faFileAlt;
        case 'storage_low':
            return faExclamationTriangle;
        case 'loading':
            return faClock;
        case 'shipment_delay':
            return faShippingFast;
        case 'design_sprint_completed':
            return faCheckCircle;
        default:
            return faBell;
    }
};

const NotificationDropdown = ({ notifications, onRead }) => {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isViewingDetails, setIsViewingDetails] = useState(false);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setIsViewingDetails(true);
        onRead(notification.id);
    };

    const handleBackToList = () => {
        setSelectedNotification(null);
        setIsViewingDetails(false);
    };

    const getFormattedTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                locale: id,
                addSuffix: true,
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Invalid Date';
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    const contentVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeInOut" } },
        exit: { opacity: 0, x: 20, transition: { duration: 0.1 } },
    };

    return (
        <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute lg:top-full top-16 lg:right-0 right-1 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-96 z-50 overflow-hidden min-w-[300px]"
        >
            <AnimatePresence mode="wait">
                {!isViewingDetails && (
                    <motion.div
                        key="notificationList"
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="max-h-96 overflow-y-auto"
                    >
                        {notifications.length === 0 ? (
                            <div className="px-4 py-2 text-gray-600">Tidak ada notifikasi.</div>
                        ) : (
                            notifications.map((notification) => {
                                const icon = getIconForNotification(notification.type);
                                const isRead = notification.status !== 'unread';
                                const bgColorClass = !isRead ? 'bg-blue-100 hover:bg-blue-200' : '';
                                const messageParts = notification.message.split(' adalah ');
                                const boldPart = !isRead && messageParts.length > 0 ? messageParts[0] + ' ' : '';
                                const regularPart = !isRead && messageParts.length > 1 ? 'adalah ' + messageParts.slice(1).join(' adalah ') : notification.message;
                                const textColorClass = 'text-gray-800';

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 flex items-start ${bgColorClass}`}
                                    >
                                        <div className="mr-3 w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center flex-shrink-0 relative">
                                            <FontAwesomeIcon icon={icon} className={textColorClass} />
                                            {isRead && <FontAwesomeIcon icon={faCheck} className="text-blue-500 text-xs absolute top-0 right-0" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`${textColorClass} line-clamp-2`}>
                                                <strong className={!isRead ? 'font-medium' : ''}>{boldPart}</strong>{regularPart}
                                            </div>
                                            <div className="text-xs text-gray-500 pt-1">
                                                <FontAwesomeIcon icon={faClock} className="inline-block mr-1 w-3 h-3" />
                                                {getFormattedTime(notification.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </motion.div>
                )}

                {isViewingDetails && selectedNotification && (
                    <motion.div
                        key={`detail-${selectedNotification.id}`}
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="p-4"
                    >
                        <div className="flex items-center mb-4">
                            <button
                                onClick={handleBackToList}
                                className="mr-2 text-gray-700 hover:text-gray-900"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-gray-900">Detail Notifikasi</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{selectedNotification.message}</p>
                        {selectedNotification.details && (
                            <div className="mt-4">
                                <h3 className="text-md font-semibold text-gray-800">Detail Tambahan:</h3>
                                <pre className="bg-gray-100 rounded-md p-2 text-sm">{JSON.stringify(selectedNotification.details, null, 2)}</pre>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default NotificationDropdown;