<script setup lang="ts">
import AddressNickName from '../components/nicknames/main.vue'
import Expand from '../components/Expand.vue'
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main class="w-[700px] px-4 py-2 text-center text-gray-700">
    <div class="flex justify-between items-center font-800 cursor-pointer mb-4">
      <img src="../assets/0xwho.png">
      <h3 class="text-5">
        0xWho
      </h3>
      <div>
        <Expand @click="openOptionsPage" />
      </div>
    </div>
    <AddressNickName />
  </main>
</template>
