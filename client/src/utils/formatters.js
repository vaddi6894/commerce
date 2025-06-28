export const formatDate = (date) => new Date(date).toLocaleDateString();
export const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;
