import UserLogin from '@/views/pages/user/UserLogin.vue'
import NotFound from '@/views/pages/NotFound.vue'
import LayoutStructure from '@/views/layouts/LayoutStructure.vue'

import BlogDashBoard from '@/views/pages/dashBoard/BlogDashBoard.vue'
import BlogCategoryList from '@/views/pages/blog/category/CategoryList.vue'
import BlogPostList from '@/views/pages/blog/post/PostList.vue'
import BlogPostForm from '@/views/pages/blog/post/PostForm.vue'

import UserList from '@/views/pages/user/UserList.vue'

export default [
  {
    path: '/',
    component: LayoutStructure,
    children: [
      {
        path: 'dashboard/blog',
        name: 'blog-dashboard',
        component: BlogDashBoard,
        meta: {
          icon: 'fa fa-home fa-lg',
          index: 0,
          requiresAuth: true,
          permissions: ['blog-dashboard', 'admin'],
          alias: ['blog-dashboard']
        },
        alias: ['/']
      },
      {
        path: 'blog/posts',
        name: 'blog-post-all',
        component: BlogPostList,
        meta: {
          requiresAuth: true,
          permissions: ['blog-post-all', 'admin'],
          alias: ['blog', 'post', 'all']
        }
      },
      {
        path: 'blog/posts/:id',
        name: 'blog-post-create',
        component: BlogPostForm,
        meta: {
          requiresAuth: true,
          permissions: ['blog-post-create', 'blog-post-update', 'admin'],
          alias: ['blog', 'post', 'create']
        }
      },
      {
        path: 'blog/categories',
        name: 'blog-cat-all',
        component: BlogCategoryList,
        meta: {
          requiresAuth: true,
          permissions: ['blog-cat-all', 'admin'],
          alias: ['blog', 'cat', 'all']
        }
      },
      {
        path: 'website/users',
        name: 'website-user',
        component: UserList,
        meta: {
          requiresAuth: true,
          permissions: ['admin'],
          alias: ['website', 'user']
        }
      },
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
