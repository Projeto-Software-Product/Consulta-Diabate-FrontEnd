import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (config.url === "/auth/login") return config;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async (error: AxiosError) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export const forbiddenInterceptor = async (fun: () => void) => {
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const data = error.response?.data as { mensagem?: string };
      if (data?.mensagem) alert(data.mensagem);
      if (error.response?.status === 401) fun();
      return Promise.reject(error);
    }
  );
};
