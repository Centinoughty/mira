import axios from "axios";

const EXCLUDED_URLS = ["/auth/google", "/auth/refresh", "/auth/me"];

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isExcluded = EXCLUDED_URLS.some((url) =>
      original?.url?.includes(url),
    );

    if (error.response?.status === 401 && !original._retry && !isExcluded) {
      original._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return api(original);
      } catch {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);
