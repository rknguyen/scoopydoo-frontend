<template>
  <div id="app">
    <a-spin tip="Loading..." :spinning="$store.state.routeLoading">
      <div class="full-height">
        <router-view />
      </div>
    </a-spin>
  </div>
</template>

<style>
body {
  background-color: #f0f2f5 !important;
}

.full-height {
  height: 100vh;
}
</style>
