<template>
  <!-- Left Sidebar -->
  <aside id="leftsidebar" class="sidebar">
    <!-- User Info -->
    <div class="user-info">
      <div class="image"> <img src="/assets/images/xs/avatar1.jpg" width="48" height="48" alt="User" /> </div>
      <div class="info-container">
        <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">{{ `${ user.firstName } ${ user.lastName }` }}</div>
        <div class="email">{{ user.email }}</div>
        <div class="btn-group user-helper-dropdown"> <i class="material-icons" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="true" role="button"> keyboard_arrow_down </i>
          <ul class="dropdown-menu pull-right">
            <li><a href="profile.html"><i class="material-icons">person</i>Profile</a></li>
            <li class="divider"></li>
            <li><a href="javascript:void(0);"><i class="material-icons">group</i>Followers</a></li>
            <li><a href="javascript:void(0);"><i class="material-icons">shopping_cart</i>Sales</a></li>
            <li><a href="javascript:void(0);"><i class="material-icons">favorite</i>Likes</a></li>
            <li class="divider"></li>
            <li><a @click="logout()" href="javascript:void(0);"><i class="material-icons">input</i>Sign Out</a></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- #User Info -->
    <!-- Menu -->
    <div class="menu">
      <ul class="list">
        <li class="header">MAIN NAVIGATION</li>
        <li :class="{ 'active open': isMainRoute('dashboard') }">
          <a href="javascript:void(0);" class="menu-toggle">
            <i class="zmdi zmdi-home"></i><span>Dashboard</span>
          </a>
            <ul class="ml-menu">
              <router-link to="/dashboard/blog" custom v-slot="{ navigate, href }">
                <li v-permissions="['admin', 'blog-dashboard']" :class="{ 'active': isSubRoute(['blog-dashboard']) }">
                  <a :class="{ 'toggled': isSubRoute(['blog-dashboard']) }" class="waves-effect waves-block" :href="href" @click="navigate">Blog Dashboard</a>
                </li>
              </router-link>
            </ul>
        </li>
        <li v-permissions="['admin', 'blog-post-all', 'blog-cat-all']" :class="{ 'active open': isMainRoute('blog') }">
          <a href="javascript:void(0);" class="menu-toggle">
            <i class="zmdi zmdi-blogger"></i><span>Blog</span>
          </a>
          <ul class="ml-menu">
            <router-link to="/blog/posts" custom v-slot="{ navigate, href }">
              <li v-permissions="['admin', 'blog-post-all']" :class="{ 'active': isSubRoute(['blog-post-all', 'blog-post-create']) }">
                <a :class="{ 'toggled waves-effect waves-block': isSubRoute(['blog-post-all', 'blog-post-create']) }" class="waves-effect waves-block" :href="href" @click="navigate">Posts</a>
              </li>
            </router-link>
            <router-link to="/blog/categories" custom v-slot="{ navigate, href }">
              <li v-permissions="['admin', 'blog-cat-all']" :class="{ 'active': isSubRoute(['blog-cat-all']) }">
                <a :class="{ 'toggled': isSubRoute(['blog-cat-all']) }" class="waves-effect waves-block" :href="href" @click="navigate">Categories</a>
              </li>
            </router-link>
          </ul>
        </li>
        <li :class="{ 'active open': isMainRoute('website') }">
          <a href="javascript:void(0);" class="menu-toggle">
            <i class="zmdi zmdi-view-web"></i><span>Website</span>
          </a>
          <ul class="ml-menu">
            <router-link to="/website/users" custom v-slot="{ navigate, href }">
              <li v-permissions="['admin']" :class="{ 'active': isSubRoute(['website-user']) }">
                <a :class="{ 'toggled': isSubRoute(['website-user']) }" class="waves-effect waves-block" :href="href" @click="navigate">Users</a>
              </li>
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
    <!-- #Menu -->
  </aside>
</template>

<script setup>
import * as auth from '@/utils/auth'
import router from '@/router'
import { useRoute } from 'vue-router'
import { getUser } from '@/utils/auth'

const user = getUser()
const route = useRoute()

const isMainRoute = (routeName) => {
  // Frist value before the dot is the main route
  return route.name.split('-').shift() === routeName.split('-').shift()
}
const isSubRoute = (routeNames) => {
  // Frist value after the dot is the sub route
  let isSub = false
  routeNames.forEach(routeName => {
    if (route.name === routeName) {
      isSub = true
    }
  })

  return isSub
}

const logout = () => {
  auth.logout()
  router.go('/')
}
</script>

<style></style>
