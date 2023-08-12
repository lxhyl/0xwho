import { useStorageLocal } from '~/composables/useStorageLocal'

export type Address = `0x${string}`
export interface NicknameItem {
  address: Address
  nickname: string
}

export const nickNameList = useStorageLocal('0xWho-address-nickName-list', {})
