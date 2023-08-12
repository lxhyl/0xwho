<script setup lang="ts">
import { defineProps, ref } from 'vue'
const props = defineProps({
  nickname: String,
  address: String,

})

const showNickname = ref(true)
const flip = (e: Event) => {
  e.preventDefault()
  showNickname.value = !showNickname.value
}
</script>

<template>
  <span class="vertical-align: middle">
    <img src="../../assets/0xwho.png" style="width: 24px; height: auto;" alt="" srcset="" @click="flip">
    {{ showNickname ? props.nickname : props.address }}
  </span>
</template>
