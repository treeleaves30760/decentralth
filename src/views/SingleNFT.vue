<template>
    <h1>Single NFT Page</h1>
    <div>{{$route.params.tokenId}}</div>
    <div>{{$route.params.contract_address}}</div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref } from '@vue/reactivity'
import Swal from 'sweetalert2'
import BuildContracts from "../Contract/Contract"

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        console.log(router, route)
        console.log(route.params.tokenId)
        console.log(route.params.contract_address)

        var contracts
        const UserBalance = ref(0)
        const UserAddress = ref("")
        // Check UserAddress and Balance
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((res) => {
                UserAddress.value = res[0]
                console.log(UserAddress)
                console.log("Metamask Checked")
            }).then(() => {
                BuildContracts.Contracts().then((res) => {
                    contracts = res
                    return contracts
                }).then((contracts) => {
                    contracts.TokenContract.methods.getLoginTable(UserAddress.value).call().then(res=>{
                        console.log("The login date", res)
                    });
                    contracts.TokenContract.methods.balanceOf(UserAddress.value).call().then((res) => {
                        UserBalance.value = res / (10**18)
                    })
                })
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please install Metamask',
                footer: '<a href="https://metamask.io/">Go to Metamask</a>'
            })
        }
    },
}
</script>

<style scoped>

</style>