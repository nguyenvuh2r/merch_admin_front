<template>
  <AuthorizationFallback :permissions="['dashboard-blog', 'admin']">
    <div class="block-header">
      <div class="row">
        <div class="col-lg-7 col-md-6 col-sm-12">
          <h2>Blog Dashboard</h2>
        </div>
        <div class="col-lg-5 col-md-6 col-sm-12">
          <ul class="breadcrumb float-md-right">
            <li class="breadcrumb-item"><a href="index.html"><i class="zmdi zmdi-home"></i> Merch</a></li>
            <li class="breadcrumb-item active">Blog Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  </AuthorizationFallback>
</template>

<script setup>
  import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'
</script>

<style></style>