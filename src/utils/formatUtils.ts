export const formatCurrency = (amount: number, currency: string): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch {
    // Fallback if currency code is not supported
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if parsing fails
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString; // Return original string if parsing fails
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
