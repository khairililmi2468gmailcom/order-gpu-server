// src/utils/calculateTotal.js
export const calculateTotalCost = (pricePerHour, durationDays) => {
    const hoursPerDay = 24;
    return parseFloat(pricePerHour) * hoursPerDay * durationDays;
  };
  