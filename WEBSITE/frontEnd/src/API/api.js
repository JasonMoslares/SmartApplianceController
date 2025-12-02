import axios from 'axios'

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    res => res,
    async(error) => {
        const originalRequest = error.config;
        if(error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry){
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if(!refreshToken){
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
            }

            try{
                const response = await axios.post('http://localhost:4000/token', {}, {
                    headers: {'x-refresh-token': refreshToken}
                })
                
                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
            catch(refreshError){
                console.log("Refresh failed -> Logging out");
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;