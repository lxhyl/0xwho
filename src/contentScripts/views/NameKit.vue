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
  <span style="vertical-align: middle; display: inline-flex; line-height: 1.5;">
    <img src="../../assets/0xwho.png" style="width: 18px; height: auto; margin-right: 2px; cursor: pointer;" alt="" srcset="" @click="flip">
    {{ showNickname ? props.nickname : props.address }}
  </span>
</template>
