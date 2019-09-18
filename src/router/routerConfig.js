const home = () => import('@/views/home');
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
  }
];
