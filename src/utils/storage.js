// Safe LocalStorage Persistence Utility with in-memory fallback

const MEMORY_STORAGE = {};

export function loadState(key, fallbackValue) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const serialized = window.localStorage.getItem(`apex_school_${key}`);
      if (serialized === null) {
        return fallbackValue;
      }
      return JSON.parse(serialized);
    }
  } catch (err) {
    console.warn(`Error loading ${key} from localStorage:`, err);
  }
  return MEMORY_STORAGE[key] !== undefined ? MEMORY_STORAGE[key] : fallbackValue;
}

export function saveState(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(`apex_school_${key}`, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
  MEMORY_STORAGE[key] = value;
}

export function clearSchoolStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(window.localStorage).forEach(k => {
        if (k.startsWith('apex_school_')) {
          window.localStorage.removeItem(k);
        }
      });
    }
  } catch (err) {
    console.warn('Error clearing school storage:', err);
  }
}
