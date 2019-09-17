const home = () => import('@/views/home');


export default [
  {
    path:'/',
    redirect: '/home',
  },
  {
    path:'/home',
    component:home,
    name:'home',
    props: (router) => {
      /*return {
        type: router.query.type
      }*/
    },
  },
];
