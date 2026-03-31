
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter (A-Z)' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter (a-z)' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number (0-9)' };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@, #, $, !)' };
  }

  return { isValid: true, message: '' };
};


export const validateUsername = (username: string): ValidationResult => {
  if (username.trim().length === 0) {
    return { isValid: false, message: 'Username cannot be empty' };
  }

  return { isValid: true, message: '' };
};
