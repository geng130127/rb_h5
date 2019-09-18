import axios  from '@common/api/http' // 导入 api

const apiList = {
  //获取文章列表
  getArticleList:(params)=>{
    return axios({
      url: 'article/v1/search',
      method: 'GET',
      params
    })
  },

  //获取文章详情
  getArticleDetail:(params)=>{
    return axios({
      url: '/article/v1/get_article',
      method: 'GET',
      params
    })
  },

  //获取媒体页面数据
  getMediaData:(params)=>{
    return axios({
      url: '/media/v1/search',
      method: 'GET',
      params
    })
  },

  //文章点赞或者取消点赞
  articleLike:(params)=>{
    return axios({
      url: '/article/v1/like',
      method: 'GET',
      params
    })
  }
};

export default apiList;
