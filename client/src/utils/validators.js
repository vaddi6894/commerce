export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const isValidPassword = (password) => password.length >= 6;
