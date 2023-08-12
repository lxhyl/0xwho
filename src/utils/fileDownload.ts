export function fileDownload(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/plain' })

  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName

  document.body.appendChild(downloadLink)

  downloadLink.click()

  URL.revokeObjectURL(downloadLink.href)
  document.body.removeChild(downloadLink)
}
