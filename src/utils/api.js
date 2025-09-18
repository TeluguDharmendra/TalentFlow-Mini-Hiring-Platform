// API utility functions
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRandomDelay = () => Math.floor(Math.random() * 1000) + 200; // 200-1200ms

export const shouldSimulateError = () => Math.random() < 0.07; // 7% error rate

export const simulateNetworkRequest = async (operation) => {
  await delay(getRandomDelay());

  if (shouldSimulateError()) {
    throw new Error("Network error: Operation failed");
  }

  return operation();
};

// Pagination helper
export const paginate = (items, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: items.slice(startIndex, endIndex),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
    hasNext: endIndex < items.length,
    hasPrevious: page > 1,
  };
};

// Search and filter helpers
export const searchItems = (items, searchTerm, searchFields) => {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    searchFields.some((field) => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};

export const filterItems = (items, filters) => {
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (!value || value === "all") return true;

      const itemValue = getNestedValue(item, key);
      if (Array.isArray(itemValue)) {
        return itemValue.includes(value);
      }
      return itemValue === value;
    })
  );
};

export const sortItems = (items, sortBy, sortOrder = "asc") => {
  return [...items].sort((a, b) => {
    const aValue = getNestedValue(a, sortBy);
    const bValue = getNestedValue(b, sortBy);

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

// Helper to get nested values safely
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// URL helpers
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// ✅ Corrected parseQueryString function
export const parseQueryString = (search) => {
  const params = new URLSearchParams(search);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};

// Local storage helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

// Form validation helpers
export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateSlug = (slug) => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug);
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Date formatting helpers
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-US", defaultOptions).format(new Date(date));
};

export const formatDateTime = (date) => {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// Number formatting helpers
export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = getNestedValue(item, key);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const unique = (array) => [...new Set(array)];

export const uniqueBy = (array, key) => {
  const seen = new Set();
  return array.filter((item) => {
    const value = getNestedValue(item, key);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// Debounce helper
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle helper
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
