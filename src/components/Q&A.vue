<template>
  <div>
      <h2>{{Title}}</h2>
      <h3>{{question}}</h3>
      <p>{{answer}}</p>
      <h4>{{author}}</h4>
  </div>
</template>

<script>
import { toRef } from '@vue/reactivity'
export default {
    name: "Q&A",
    props: ["Title", "Question", "Answer", "Author"],
    setup(props) {
        const title = toRef(props, "Title")
        const question = toRef(props, "Question")
        const answer = toRef(props, "Answer")
        const author = toRef(props, "Author")

        return {
            title,
            question,
            answer,
            author,
        }
    }
}
</script>

<style>

</style>