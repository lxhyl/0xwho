import type { Address } from '~/utils/types'

const ethereumAddressPatternStrict = /^0x[a-fA-F0-9]{40}$/

export interface MatcherReturn {
  node: Node
  address: Address
}

export function fullAddressTextNode(node: Node): MatcherReturn | undefined {
  if (node.nodeType !== Node.TEXT_NODE)
    return
  const address = node.textContent?.trim()
  if (address?.match(ethereumAddressPatternStrict))
    return { address: address as Address, node: node.parentNode as Node }
}

export function prefixAndSuffixANode(node: Node): MatcherReturn | undefined {
  if (node.nodeName !== 'A')
    return
  const splitHref = (node as HTMLAnchorElement).href.split('/')
  const last = splitHref[splitHref.length - 1]
  if (last.match(ethereumAddressPatternStrict) && node.textContent?.startsWith('0x'))
    return { address: last as Address, node }
}
