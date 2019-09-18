const home = () => import('@/views/home');
const news=() => import('@/views/news');
const articleDetail = () => import('@/views/articleDetail');


export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: home,
    name: 'home',
    props: (router) => {
      return {
        id: router.query.id
      }
    },
  },
  {
    path: '/article:id',
    component: articleDetail,
    name: 'articleDetail',
    props: true
  },
  {
    path:'/news',
    component:news,
    name:'news',
    props: (router) => {
      return {
        tagid: router.query.tagid
      }
    },
  }
];
