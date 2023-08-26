import { fullAddressTextNode, prefixAndSuffixANode } from './matcher'
import type { Address } from '~/utils/types'

export function findEthereumAddressesAndNode(): Map<Node, Address> {
  const resultMap = new Map<Node, Address>()

  const deepFn = (node: Node) => {
    const match = fullAddressTextNode(node) || prefixAndSuffixANode(node)
    if (match)
      resultMap.set(match.node, match.address)

    if (node.childNodes.length === 0)
      return
    for (let i = 0; i < node.childNodes.length; i++)
      deepFn(node.childNodes[i])
  }
  deepFn(document.body)
  return resultMap
}
