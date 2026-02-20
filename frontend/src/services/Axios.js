import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://635a-103-141-54-142.ngrok-free.app/api/",
  timeout: 300000,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");

    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    if (response) {
      switch (response.status) {
        case 400:
          console.error("Bad Request:", response.data);
          break;

        case 401:
          console.error("Unauthorized:", response.data);
          toast.info("Session expired, please login again");
          sessionStorage.clear();
          window.location.href = "/login";
          break;

        case 403:
          console.error("Forbidden:", response.data);
          break;

        case 404:
          console.error("Not Found:", response.data);
          break;

        case 409:
        case 422:
          toast.warn(response?.data?.detail || "Oops, something went wrong");
          break;

        case 500:
        case 502:
          console.error("Server Error:", response.data);
          toast.error("Oops, something went wrong");
          break;

        default:
          console.error(`Error: ${response.status}`, response.data);
          toast.error("Oops, something went wrong");
      }
    } else {
      console.error("Network Error:", error.message);
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  },
);

// ================= COMMON REQUEST HANDLER =================
async function handleApiRequest(apiFunction, path, ...args) {
  try {
    const response = await apiFunction(path, ...args);
    return response.data;
  } catch (error) {
    throw {
      error: error.toString(),
      errorResponse: error.message,
    };
  }
}

// ================= API METHODS =================
export async function getAPI(path, config) {
  return handleApiRequest(axiosInstance.get, path, config);
}

export async function postAPI(path, body) {
  return handleApiRequest(axiosInstance.post, path, body);
}

export async function patchAPI(path, body) {
  return handleApiRequest(axiosInstance.patch, path, body);
}

export async function putAPI(path, body) {
  return handleApiRequest(axiosInstance.put, path, body);
}

export async function deleteAPI(path) {
  return handleApiRequest(axiosInstance.delete, path);
}

export async function uploadPostAPI(path, body) {
  return handleApiRequest(axiosInstance.post, path, body);
}

// ================= FILE UPLOAD =================
export async function uploadApi(path, body, type) {
  return handleApiRequest(axios.put, path, body, {
    headers: {
      "Content-Type": type,
    },
  });
}
