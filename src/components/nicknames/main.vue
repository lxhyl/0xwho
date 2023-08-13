<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import { storage } from 'webextension-polyfill'

import IconAdd from '../Add.vue'
import IconEdit from '../Edit.vue'
import IconDelete from '../Delete.vue'
import { fileDownload } from '../../utils/fileDownload'
import type { NicknameItem } from '~/logic'
import type { NicknameMap } from '~/utils/types'

const columns = [
  {
    title: 'address',
    dataIndex: 'address',
    width: '50%',
  },
  {
    title: 'nickname',
    dataIndex: 'nickname',
    width: '15%',
  },
  {
    title: 'action',
    dataIndex: 'action',
  },
]

const dataSource = ref<NicknameItem[]>([])

async function loadListFromLocal() {
  const nicknameMap: NicknameMap = (await storage.local.get('nicknameMap'))?.nicknameMap || {} as NicknameMap
  const data = Object.entries(nicknameMap).map(([address, nickname]) => ({ address, nickname })) as NicknameItem[]
  dataSource.value = data.map((item, index) => ({ ...item, address: item.address.toLowerCase(), index: index.toString() } as NicknameItem))
}
loadListFromLocal()

const editableData: UnwrapRef<Record<string, NicknameItem >> = reactive({})

const add = () => {
  const index = Date.now().toString()
  dataSource.value.unshift({
    address: '0x',
    nickname: '',
    index,
  })
  editableData[index] = dataSource.value[0]
}
const deleteItem = (index: string) => {
  dataSource.value = dataSource.value.filter(item => item.index !== index)
  const nicknameMap: NicknameMap = dataSource.value.reduce((acc, cur) => {
    acc[cur.address] = cur.nickname
    return acc
  }, {} as NicknameMap)
  storage.local.set({ nicknameMap })
}
const edit = (index: string) => {
  editableData[index] = JSON.parse(JSON.stringify((dataSource.value.filter(item => index === item.index)[0])))
}

const save = (index: string) => {
  if (!editableData[index] || /0x[a-fA-F0-9]{40}/.test(editableData[index].address) === false)
    return
  if (!editableData[index].nickname)
    return

  Object.assign(dataSource.value.filter(item => index === item.index)[0], editableData[index])
  const nicknameMap: NicknameMap = dataSource.value.reduce((acc, cur) => {
    acc[cur.address.toLowerCase() as keyof NicknameMap] = cur.nickname
    return acc
  }, {} as NicknameMap)
  storage.local.set({ nicknameMap })
  delete editableData[index]
}
const cancel = (index: number) => {
  delete editableData[index]
}

const exportFile = () => {
  fileDownload(JSON.stringify(dataSource.value.map(item => ({ address: item.address, nickname: item.nickname }))), 'nicknames.json')
}
const beforeUpload = (file: File) => {
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string) as NicknameItem[]
    const nicknameMap: NicknameMap = data.reduce((acc, cur) => {
      if (!cur)
        return acc
      if (/^0x[a-fA-F0-9]{40}$/.test(cur.address) === false || !cur.nickname)
        return acc
      acc[cur.address.toLowerCase() as keyof NicknameMap] = cur.nickname
      return acc
    }, {} as NicknameMap)
    storage.local.set({ nicknameMap })
    loadListFromLocal()
  }
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" :pagination="{ pageSize: 8 }">
    <template #headerCell="{ title }">
      <div v-if="title === 'action'" class="flex items-center cursor-pointer ">
        <div class="mr-2">
          action
        </div><IconAdd @click="add()" />
      </div>
      <div v-else>
        {{ title }}
      </div>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'action'">
        <div class="editable-row-operations">
          <div v-if="editableData[record.index]" class="flex items-center">
            <a @click="save(record.index)">Save</a>

            <a @click="cancel(record.index)">Cancel</a>
          </div>
          <div v-else class="flex items-center">
            <a @click="edit(record.index)"><IconEdit /></a>
            <a @click="deleteItem(record.index)"><IconDelete /></a>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <a-input
            v-if="editableData[record.index]"
            v-model:value="(editableData[record.index][column.dataIndex as keyof NicknameItem])"
            style="margin: -5px 0"
            class="w-full"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
    </template>
  </a-table>
  <div class="flex mt-2 gap-2">
    <a-button type="link" @click="exportFile">
      Export
    </a-button>
    <a-upload :before-upload="beforeUpload">
      <a-button type="link">
        <upload-outlined />
        Import
      </a-button>
    </a-upload>
  </div>
</template>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
