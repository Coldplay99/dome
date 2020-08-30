import axios from 'axios'
const MyHttp={}

 MyHttp.install = (Vue) => {
    // axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'

    // axios拦截器
        // （1）拦截请求（在发送请求之前做某事）
    axios.interceptors.request.use(function(config){
        //在发送请求之前做某事
        // console.log("拦截")
        // console.log(config)  //单次请求的配置信息对象

        //除了不是登录外都发送头部token
        if (config.url !== 'login') {
            const  AUTH_TOKEN = localStorage.getItem('token')
            config.headers.common['Authorization'] = AUTH_TOKEN
        }
        return config;  //只有return config后，才能成功发送请求
      },
      function(error){
        //请求错误时做些事
        return Promise.reject(error);
      })

    //   2）拦截响应
      axios.interceptors.response.use(function(data){
        // console.log("response")
        // console.log(data)  //响应数据
        return data;   //只有return data后才能完成响应
    },
    function(error){
      //请求错误时做些事
      return Promise.reject(error);
    })
    Vue.prototype.axios=axios
}
export default MyHttp