<template>
    <h1>Single NFT Page</h1>
    <div>{{$route.params.tokenId}}</div>
    <div>{{$route.params.contract_address}}</div>
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