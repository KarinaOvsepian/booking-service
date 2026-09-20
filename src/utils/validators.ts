export namespace Validation {
  export function isNotEmpty(value: string | undefined | null): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  export function isNumericId(value: string): boolean {
    return /^\d+$/.test(value.trim());
  }

  export function isValidYear(value: string | number): boolean {
    const yearStr = String(value).trim();
    const regex = /^(1\d{3}|20\d{2})$/;
    if (!regex.test(yearStr)) {
      return false;
    }
    const currentYear = new Date().getFullYear();
    const parsed = parseInt(yearStr, 10);
    return parsed >= 1000 && parsed <= currentYear;
  }

  export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}
