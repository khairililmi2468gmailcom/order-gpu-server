// src/utils/calculateTotal.js
export const calculateTotalCost = (pricePerHour, durationHours) => {
    return parseFloat(pricePerHour) * parseFloat(durationHours);
};