import Vue from 'vue';
import VueRouter from 'vue-router';

import instance from '@/instance';
import Store from '../store';

Vue.use(VueRouter);

const routes = [
  /**
   * All pages down will be main page
   */
  {
    path: '',
    component: () => import('@/layouts/Main.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/Home.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/about',
        component: () => import('@/views/About.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/processes',
        component: () => import('@/views/Processes.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/roles',
        component: () => import('@/views/Roles.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/sources',
        component: () => import('@/views/Sources.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/statuses',
        component: () => import('@/views/Statuses.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/types',
        component: () => import('@/views/Types.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/change-password',
        component: () => import('@/views/Password.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/new-account',
        component: () => import('@/views/Account.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/candidate/:id',
        component: () => import('@/views/Candidate.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  /**
   * All pages down will be no navigation bar
   */
  {
    path: '',
    component: () => import('@/layouts/Fullpage.vue'),
    children: [
      {
        path: '/login',
        component: () => import('@/views/Login.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: { path: '/' }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async function(to, from, next) {
  /**
   * Route is loading
   */
  Store.commit('routeLoading', true);

  /**
   * Check current passport is valid or not
   */
  const signedToken = window.localStorage.getItem('signed_token');
  const commitPassport = (logined: boolean, passport?: object): void =>
    Store.commit('passport', { logined, ...passport });
  if (signedToken) {
    const signedHeaders = {
      Authorization: signedToken
    };
    try {
      await instance
        .get('/user/me', { headers: signedHeaders })
        .then(response => response.data)
        .then(response => {
          commitPassport(!response.error, response.error ? {} : response.data);
          if (response.error) {
            window.localStorage.removeItem('signed_token');
          } else {
            /**
             * Update authentication headers
             */
            instance.interceptors.request.use(request => {
              if (!!window.localStorage.getItem('signed_token')) {
                request.headers.Authorization = signedToken;
              }
              return request;
            });
          }
        });
    } catch (errors) {
      commitPassport(false);
      console.log(errors);
    }
  } else {
    commitPassport(false);
  }

  /**
   * Redirect to matched route
   */
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { passport } = Store.getters;
    if (!passport.logined) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach(function() {
  /**
   * Route was loaded
   */
  setTimeout(() => Store.commit('routeLoading', false), 500);
});

export default router;
