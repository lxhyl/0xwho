<script setup lang="ts">
const props = defineProps({
  nickname: String,
  address: String,
})
</script>

<template>
  <span class="vertical-align: middle">
    <img src="../../assets/0xwho.png" style="width: 24px; height: auto;" alt="" srcset="">
    {{ props.nickname }}
  </span>
</template>
