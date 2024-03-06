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
      },
      {
        name: 'AccountResetPassword',
        path: 'reset-password',
        component: () => import('pages/auth/HaResetPassword.vue')
      },
      {
        name: 'AccountUpdatePassword',
        path: 'update-password',
        component: () => import('pages/auth/HaUpdatePassword.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        name: 'Account',
        path: 'account',
        component: () => import('pages/account/HaAccount.vue')
      }
    ],
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
