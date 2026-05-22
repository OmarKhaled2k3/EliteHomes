// API Configuration
// Uses relative path in development (proxied by package.json)
// Uses full backend URL in production (set via REACT_APP_API_URL env var)

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export default API_BASE_URL;
