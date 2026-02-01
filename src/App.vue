<template>
  <div id="app">
    <router-view />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Toast from "./components/Toast";
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  background-color: #f9fafb;
  color: #111827;
}

#app {
  min-height: 100vh;
  position: relative;
}
</style>
