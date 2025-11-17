// utils/currency.js

// Format price in Vietnamese style (e.g., 100000 to 100.000 ₫)
export const formatCurrency = (amount) => {
  // Convert to number if it's not already
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if the amount is a valid number
  if (isNaN(numAmount)) {
    return '0 ₫';
  }
  
  // Format with Vietnamese thousand separator (.) and currency symbol (₫)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

// Alternative function to format without currency symbol if needed
export const formatNumberWithDots = (amount) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }
  
  return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default formatCurrency;