import { storage } from 'webextension-polyfill'
import { createApp } from 'vue'
import NameKit from './views/NameKit.vue'

import { findEthereumAddressesAndNode } from './getAddressAndNode'
import type { NicknameMap } from '~/utils/types'

async function main() {
  const nodeAddressMap = findEthereumAddressesAndNode()
  const nicknameMap: NicknameMap = (await storage.local.get('nicknameMap'))?.nicknameMap || {} as NicknameMap
  if (!nicknameMap)
    return
  nodeAddressMap.forEach((address, node) => {
    const nickname = nicknameMap[address.toLowerCase() as keyof NicknameMap]
    if (!nickname)
      return

    const app = createApp(NameKit, { nickname, address })
    app.mount(node as Element)
  })
}

// let timer: ReturnType<typeof setTimeout> | null = null
// const observer = new MutationObserver(() => {
//   timer && clearTimeout(timer)
//   timer = setTimeout(main, 200)
// })

// const observerConfig = { attributes: false, childList: true, subtree: true, characterData: true }

// observer.observe(document.body, observerConfig)

addEventListener('load', () => {
  main()
  setTimeout(main, 5000)
})
