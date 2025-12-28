/**
 * Calculate age from Date of Birth
 * @param {string | Date} dob - Date of Birth
 * @returns {number} Age
 */
export const calculateAge = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Check if user can book a movie based on age and rating
 * @param {number} age - User's age
 * @param {string} rating - Movie rating (P, K, C13, C16, C18)
 * @returns {boolean} True if allowed
 */
export const canBookMovie = (age, rating) => {
  if (!rating) return true;
  
  const r = rating.toUpperCase();
  
  switch (r) {
    case 'P':
    case 'PG': // Legacy mapping
      return true;
    case 'K':
      return true; // Allowed with warning
    case 'C13':
    case 'PG-13': // Legacy mapping
      return age >= 13;
    case 'C16':
      return age >= 16;
    case 'C18':
    case 'R': // Legacy mapping
      return age >= 18;
    default:
      return true;
  }
};

export const getRatingColor = (rating) => {
    if (!rating) return 'default';
    const r = rating.toUpperCase();
    switch (r) {
        case 'P': 
        case 'PG':
            return 'success'; 
        case 'K': 
            return 'info'; 
        case 'C13': 
        case 'PG-13':
            return 'warning'; 
        case 'C16': 
            return 'error'; 
        case 'C18': 
        case 'R':
            return 'error'; 
        default: return 'default';
    }
};

export const getRatingDescription = (rating) => {
    if (!rating) return '';
    const r = rating.toUpperCase();
    switch (r) {
        case 'P': return 'rating.description.p';
        case 'K': return 'rating.description.k';
        case 'C13': return 'rating.description.c13';
        case 'C16': return 'rating.description.c16';
        case 'C18': return 'rating.description.c18';
        default: return '';
    }
};
