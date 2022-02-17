<template>
    <h1>Single NFT Page</h1>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()

        console.log(router, route)
    },
}
</script>

<style scoped>

</style>