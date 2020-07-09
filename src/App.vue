<template>
  <div id="Player" class="Viewer">
    <PDFViewer :source="pdf" :page="page"/>
    <navigation class="Viewer__Navigation">
      <button :disabled="decrementDisabled" @click="decrementPage">Back</button>
      <span>{{page}}</span>
      <button :disabled="incrementDisabled" @click="incrementPage">Next</button>
    </navigation>
  </div>
</template>

<script>
import {
  reactive, onMounted, toRefs, computed
} from 'vue'
import PDFViewer from './components/PDFViewer.vue'

import getPdf from './common/getPdf'

export default {
  name: 'App',
  components: {
    PDFViewer
  },
  setup() {
    const state = reactive({
      pdf: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      page: 1,
      pages: null
    })

    const incrementDisabled = computed(() => state.page === state.pages)
    const decrementDisabled = computed(() => state.page === 1)

    const incrementPage = () => { state.page += 1 }
    const decrementPage = () => { state.page -= 1 }

    const getPdfDetails = async () => {
      const pdf = await getPdf(state.pdf).promise
      // eslint-disable-next-line no-underscore-dangle
      state.pages = pdf._pdfInfo.numPages
      console.log(state.pages)
    }

    onMounted(() => {
      getPdfDetails()
    })

    return {
      ...toRefs(state),
      incrementPage,
      decrementPage,
      decrementDisabled,
      incrementDisabled
    }
  }
}
</script>

<style lang="scss">
.Viewer{
  &__Navigation{
    position: absolute;
    top: 5%;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
