const API = axios.create({
  baseURL: "https://api.github.com",
  timeout: 3000,
});

API.interceptors.request.use(
  (request) => handleRequest(request),
  (errors) => Promise.reject(errors)
);

API.interceptors.response.use(
  (response) => handleResponse(response),
  (error) => {
    return Promise.reject({
      errorMessage: error?.response?.data,
      errorResponse: error.response,
      errorEntity: error,
    });
  }
);

// TODO: 完善拦截器
function handleRequest(request) {
  return request;
}

function handleResponse(response) {
  return {
    data: response?.data,
    status: response?.status,
    response,
  };
}

export default API;
