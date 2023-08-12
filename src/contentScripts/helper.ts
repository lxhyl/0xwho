const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/

export function findEthereumAddressesInNode(): Node[] {
  const resultSet = new Set<Node>()

  const deepFn = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const matches = node.textContent?.match(ethereumAddressPattern)
      if (matches)
        resultSet.add(node.parentNode as Node)
    }
    else {
      for (let i = 0; i < node.childNodes.length; i++)
        deepFn(node.childNodes[i])
    }
  }
  deepFn(document.body)
  return Array.from(resultSet)
}
