import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../pages/HomePage.vue';
import BoardDetailPage from '../pages/BoardDetailPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: '二游节奏榜 | 首页',
      },
    },
    {
      path: '/board/:id',
      name: 'board-detail',
      component: BoardDetailPage,
      meta: {
        title: '二游节奏榜 | 榜单详情',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.afterEach((to) => {
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  }
});

export default router;
