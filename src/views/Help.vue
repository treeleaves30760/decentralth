<template>
    <div class="Help p-2">
        <QA 
            Title="Test"
            Answer="Testing for a long time"
            Author="Team"
            Question="What is this"
        />
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import QA from "../components/Q&A.vue" 
export default {
    name: "Help",
    components: {
        QA
    },
    setup() {
        const title = ref("如何購買")
        return {
            title
        }
    }
}
</script>

<style>

</style>