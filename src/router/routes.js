import UserLogin from '@/views/pages/user/UserLogin.vue'
import NotFound from '@/views/pages/NotFound.vue'
import LayoutStructure from '@/views/layouts/LayoutStructure.vue'
import DashBoard from '@/views/pages/DashBoard.vue'

export default [
  {
    path: '/',
    component: LayoutStructure,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashBoard,
        meta: {
          icon: 'fa fa-home fa-lg',
          index: 0,
          requiresAuth: true,
          permissions: ['view-dashboard', 'admin'],
          alias: ['dashboard']
        },
        alias: ['/dashboard']
      },
      {
        path: 'blog/list',
        name: 'blog.list',
        component: {
          template: '<h2>Blog list</h2>'
        },
        meta: {
          requiresAuth: true,
          permissions: ['blog-view-post', 'admin'],
          alias: ['blog', 'post', 'list']
        }
      },
      {
        path: 'blog/add',
        name: 'blog.add',
        component: {
          template: '<h2>Blog add new</h2>'
        },
        meta: {
          requiresAuth: true,
          permissions: ['blog-edit-post', 'admin'],
          alias: ['blog', 'post', 'add']
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: UserLogin,
    meta: {
      requiresAuth: false,
      permissions: []
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      requiresAuth: false,
      permissions: []
    }
  }
]
