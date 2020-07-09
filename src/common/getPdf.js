import pdfjsLib from 'pdfjs-dist/webpack'

export default function getPdf(source) {
  const loadingTask = pdfjsLib.getDocument(source)
  // eslint-disable-next-line no-underscore-dangle
  loadingTask.__PDFDocumentLoadingTask = true
  return loadingTask
}
