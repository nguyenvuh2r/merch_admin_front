<script setup>
  import ConfirmModal from '@/components/page/ConfirmModal.vue'
</script>

<template>
  <div id="app">
    <!-- Page Loader -->
    <!-- <div class="page-loader-wrapper">
      <div class="loader">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <p>Please wait...</p>
        <div class="m-t-30"><img src="/assets/images/logo.svg" width="48" height="48" alt="Nexa"></div>
      </div>
    </div> -->
    <!-- Page Loader -->
    <!-- Overlay For Sidebars -->
    <div class="overlay"></div><!-- Search  -->
    <div class="search-bar">
      <div class="search-icon"> <i class="material-icons">search</i> </div>
      <input type="text" placeholder="Explore Nexa...">
      <div class="close-search"> <i class="material-icons">close</i> </div>
    </div>

    <router-view />

  </div>

  <ConfirmModal />
</template>

<style scoped>

</style>
