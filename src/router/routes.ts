import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        name: 'AccountLogin',
        path: 'login',
        component: () => import('pages/auth/HaLogin.vue')
      },
      {
        name: 'AccountRegistration',
        path: 'registration',
        component: () => import('pages/auth/HaRegistration.vue')
      }
    ]
  },
  {
    name: 'Home',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: {
      auth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
