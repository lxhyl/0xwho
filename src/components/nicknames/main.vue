<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { UnwrapRef } from 'vue'
import { storage } from 'webextension-polyfill'
import IconAdd from '../Add.vue'
import IconEdit from '../Edit.vue'
import IconDelete from '../Delete.vue'
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
  dataSource.value = data
}
loadListFromLocal()

const editableData: UnwrapRef<Record<string, NicknameItem >> = reactive({})

const add = () => {
  dataSource.value.unshift({
    address: '0x',
    nickname: '',
  })
  editableData['0x'] = dataSource.value[0]
}
const deleteItem = (address: string) => {
  dataSource.value = dataSource.value.filter(item => item.address !== address)
  const nicknameMap: NicknameMap = dataSource.value.reduce((acc, cur) => {
    acc[cur.address] = cur.nickname
    return acc
  }, {} as NicknameMap)
  storage.local.set({ nicknameMap })
}
const edit = (address: string) => {
  editableData[address] = JSON.parse(JSON.stringify((dataSource.value.filter(item => address === item.address)[0])))
}

const save = (address: string) => {
  if (!editableData[address] || /0x[a-fA-F0-9]{40}/.test(editableData[address].address) === false)
    return
  if (!editableData[address].nickname)
    return
  Object.assign(dataSource.value.filter(item => address === item.address)[0], editableData[address])
  const nicknameMap: NicknameMap = dataSource.value.reduce((acc, cur) => {
    acc[cur.address] = cur.nickname
    return acc
  }, {} as NicknameMap)
  storage.local.set({ nicknameMap })
  delete editableData[address]
}
const cancel = (key: string) => {
  delete editableData[key]
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource">
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
          <div v-if="editableData[record.address]" class="flex items-center">
            <a @click="save(record.address)">Save</a>

            <a @click="cancel(record.address)">Cancel</a>
          </div>
          <div v-else class="flex items-center">
            <a @click="edit(record.address)"><IconEdit /></a>
            <a @click="deleteItem(record.address)"><IconDelete /></a>
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <a-input
            v-if="editableData[record.address]"
            v-model:value="(editableData[record.address][column.dataIndex as keyof NicknameItem])"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
    </template>
  </a-table>
</template>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
