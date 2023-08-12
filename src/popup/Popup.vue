<script setup lang="ts">
import AddressNickName from '../components/nicknames/main.vue'
import Expand from '../components/Expand.vue'
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[700px] px-4 py-5 text-center text-gray-700">
    <div class="flex justify-between items-center font-800 cursor-pointer mb-4" @click="openOptionsPage">
      <div />
      <h3>0xWho</h3>
      <Expand />
    </div>
    <AddressNickName />
  </main>
</template>
