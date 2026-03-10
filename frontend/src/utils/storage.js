const STORAGE_KEY = "bookhive_auth";

export const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    return JSON.parse(raw);
  } catch {
    return { token: null, user: null };
  }
};

export const saveAuth = (payload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getToken = () => {
  const auth = loadAuth();
  return auth?.token || null;
};
