export type Address = `0x${string}`
export interface NicknameMap {
  [key: Address]: string
}
export interface NicknameItem {
  address: Address
  nickname: string
}
