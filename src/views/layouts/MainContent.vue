<template>
  <!-- Main content area -->
  <section class="content">
    <div class="block-header">
      <div class="row">
        <div class="col-lg-7 col-md-6 col-sm-12">
          <h2>Stater Page
            <small class="text-muted">Welcome to Merchifies Admin</small>
          </h2>
        </div>
        <div class="col-lg-5 col-md-6 col-sm-12">
          <ul class="breadcrumb float-md-right">
            <li class="breadcrumb-item"><a href="index.html"><i class="zmdi zmdi-home"></i> Merchifies</a></li>
            <li class="breadcrumb-item"><a href="javascript:void(0);">Extra</a></li>
            <li class="breadcrumb-item active">Stater Page</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row clearfix">
        <div class="col-lg-12">
          <div class="card">
            <div class="body">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>

</script>

<style></style>
