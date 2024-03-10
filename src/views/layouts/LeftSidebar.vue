<template>
  <!-- Left Sidebar -->
  <aside id="leftsidebar" class="sidebar">
    <!-- User Info -->
    <div class="user-info">
      <div class="image"> <img src="/assets/images/xs/avatar1.jpg" width="48" height="48" alt="User" /> </div>
      <div class="info-container">
        <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">John Doe</div>
        <div class="email">john.doe@example.com</div>
        <div class="btn-group user-helper-dropdown"> <i class="material-icons" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="true" role="button"> keyboard_arrow_down </i>
          <ul class="dropdown-menu pull-right">
            <li><a href="profile.html"><i class="material-icons">person</i>Profile</a></li>
            <li class="divider"></li>
            <li><a href="javascript:void(0);"><i class="material-icons">group</i>Followers</a></li>
            <li><a href="javascript:void(0);"><i class="material-icons">shopping_cart</i>Sales</a></li>
            <li><a href="javascript:void(0);"><i class="material-icons">favorite</i>Likes</a></li>
            <li class="divider"></li>
            <li><a href="sign-in.html"><i class="material-icons">input</i>Sign Out</a></li>
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
          <a href="/"><i class="zmdi zmdi-home"></i><span>Dashboard</span></a>
        </li>
        <li :class="{ 'active open': isMainRoute('blog') }">
          <a href="javascript:void(0);" class="menu-toggle">
            <i class="zmdi zmdi-blogger"></i><span>Blog</span>
          </a>
          <ul class="ml-menu">
            <li :class="{ 'active': isSubRoute('blog.list') }"><a href="/blog/list">Blog List</a></li>
            <li :class="{ 'active': isSubRoute('blog.add') }"><a href="/blog/add">Blog Add</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- #Menu -->
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isMainRoute = (routeName) => {
  // Frist value before the dot is the main route
  return route.name.split('.').shift() === routeName.split('.').shift()
}
const isSubRoute = (routeName) => {
  // Frist value after the dot is the sub route
  return route.name === routeName
}
</script>

<style></style>
