import Vue from 'vue'
import Router from 'vue-router'
import routerConfig from './routerConfig'

Vue.use(Router);

const router = new Router({
  //mode: 'history',
  routes: [
    ...routerConfig
  ],
  linkActiveClass:'nav-active'
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `Red And Blue` : 'Red And Blue';
  next();
});
router.afterEach((to, from, next) => {
  window.scrollTo(0,0);
});

export default router;
