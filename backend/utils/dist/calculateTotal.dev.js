"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateTotalCost = void 0;

// src/utils/calculateTotal.js
var calculateTotalCost = function calculateTotalCost(pricePerHour, durationHours) {
  return parseFloat(pricePerHour) * parseFloat(durationHours);
};

exports.calculateTotalCost = calculateTotalCost;