import { storage } from 'webextension-polyfill'
import { createApp } from 'vue'
import NameKit from './views/NameKit.vue'

import { findEthereumAddressesInNode } from './helper'
import type { NicknameMap } from '~/utils/types'

// // Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
// (() => {
//   console.info('[vitesse-webext] Hello world from content script')

//   // communication example: send previous tab title from background page
//   onMessage('tab-prev', ({ data }) => {
//     console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
//   })

//   // mount component to context window
//   const container = document.createElement('div')
//   container.id = __NAME__
//   const root = document.createElement('div')
//   const styleEl = document.createElement('link')
//   const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
//   styleEl.setAttribute('rel', 'stylesheet')
//   styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
//   shadowDOM.appendChild(styleEl)
//   shadowDOM.appendChild(root)
//   document.body.appendChild(container)
//   const app = createApp(App)
//   setupApp(app)
//   app.mount(root)
// })()

async function main() {
  const allNode = findEthereumAddressesInNode()
  const nicknameMap: NicknameMap = (await storage.local.get('nicknameMap'))?.nicknameMap || {} as NicknameMap
  if (!nicknameMap)
    return
  for (const node of allNode) {
    let address: string | null | undefined = node.textContent
    if (!address?.match(/^0x[a-fA-F0-9]{40}$/)) {
      if (node.nodeName === 'A')
        address = (node as Element).getAttribute('href')?.match(/0x[a-fA-F0-9]{40}/)?.[0]
    }
    if (!address)
      continue
    const nickname = nicknameMap[address.toLowerCase() as keyof NicknameMap]
    if (!nickname)
      continue
    // clear all child nodes
    while (node.firstChild)
      node.removeChild(node.firstChild)
    // append nickname
    const app = createApp(NameKit, { nickname, address })
    app.mount(node as Element)
  }
}

window.onload = function () {
  main()
  setTimeout(main, 5000)
}
