const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['x-auth-token'] = token;
    }

    // Set default Content-Type to application/json if not sending FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // If sending FormData, let the browser set Content-Type (remove it if manually set to multipart/form-data)
    if (options.body instanceof FormData && headers['Content-Type'] === 'multipart/form-data') {
        delete headers['Content-Type'];
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 204 No Content
    if (response.status === 204) {
        return { data: null, status: response.status };
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.message || 'Request failed');
        error.response = {
            data: data,
            status: response.status,
            statusText: response.statusText,
        };
        throw error;
    }

    return { data, status: response.status };
};

const api = {
    get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
    put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
    delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;