<template>
    <div id="viewerContainer" ref="container">
      <div id="viewer" class="pdfViewer" />
    </div>
</template>

<script>
import 'pdfjs-dist/web/pdf_viewer.css'
// eslint-disable-next-line max-len
import {
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  PDFLinkService,
  PDFPageView
} from 'pdfjs-dist/web/pdf_viewer'

import { onMounted, ref, watch } from 'vue'
import getPdf from '../common/getPdf'

export default {
  name: 'PDFViewer',
  props: {
    msg: String,
    source: {
      type: String,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const state = {
      pdf: null,
      pdfViewer: null,
      loading: true,
      scale: 1.25
    }

    // Refs
    const container = ref(null)

    async function loadPDF() {
      const loadingTask = typeof props.source === 'string' ? getPdf(props.source) : props.source

      state.pdf = await loadingTask.promise
      const page = await state.pdf.getPage(props.page)
      const pdfContainer = container.value
      const annotationLayer = new DefaultAnnotationLayerFactory()
      const textLayer = new DefaultTextLayerFactory()
      const pdfLinkService = new PDFLinkService()

      state.pdfViewer = new PDFPageView({
        container: pdfContainer,
        id: props.page,
        scale: state.scale,
        defaultViewport: page.getViewport({ scale: state.scale }),
        textLayerFactory: textLayer,
        annotationLayerFactory: annotationLayer
      })

      state.pdfViewer.setPdfPage(page)
      pdfLinkService.setViewer(state.pdfViewer)
      state.pdfViewer.draw()
      state.loading = false
    }

    watch(() => props.page, async () => {
      const page = await state.pdf.getPage(props.page)
      state.pdfViewer.setPdfPage(page)
      state.pdfViewer.draw()
    })

    onMounted(() => {
      loadPDF()
    })

    return {
      container
    }
  }
}
</script>
