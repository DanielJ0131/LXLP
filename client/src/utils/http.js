

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const defaultHeaders = {
    'Authorization': `${token}`,
    'Content-Type': 'application/json',
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  return fetch(url, mergedOptions);
};
