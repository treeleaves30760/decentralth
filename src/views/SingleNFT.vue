<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-lg-5 col-sm-12">
                <div class="card leftcard">
                    <img 
                        class="cardImg"
                        :src="OneNFTContract.SingleNFT.Img" 
                        alt=""
                    >
                </div>
            </div>
            <div class="col">
                <div class="card p-2 text-start">
                    <div class="fst-italic text-start">{{OneNFTContract.NFT_name}}</div>
                    <div class="card m-2">
                        <h3 class="card-title align-middle m-2">NFT Name</h3>
                        <div class="card-text bg-light fs-5">
                            <div class="m-3">{{OneNFTContract.SingleNFT.name}}</div>
                        </div>
                    </div>
                    <div class="card m-2">
                        <h3 class="card-title align-middle m-2">Description</h3>
                        <div class="card-text bg-light fs-5">
                            <div class="m-3">{{ OneNFTContract.SingleNFT.description }}</div>
                        </div>
                    </div>
                    <div class="card m-2">
                        <h3 class="card-title align-middle m-2">Details</h3>
                        <div class="card-text bg-light fs-5">
                            <div class="m-3">
                                <p>TokenId : {{$route.params.tokenId}}</p>
                                <p>ContractAddress : {{$route.params.contract_address}}</p>
                                <div>Owned By</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive } from '@vue/reactivity'
import { useWallet, useEthers } from 'vue-dapp'
import Swal from 'sweetalert2'
import Moapi from "../Moralis/Marolis"

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        console.log(router, route)
        console.log(route.params.tokenId)
        console.log(route.params.contract_address)

        var contracts
        const UserAddress = ref("")
        const UserTokenBalance = ref(0)
        const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/")
        const OneNFTContract = {
            NFT_name: ref(""),
            contract_address: ref(0),
            SingleNFT: reactive({
                name: ref(""),
                description: ref(""),
                Img: ref(""),
                TokenId: ref(0),
                Price: ref(0.8),
            })
        }

        Moapi.ContractgetAllTokenIds(route.params.contract_address).then((res) => {
            return res.result
        }).then((result) => {
            OneNFTContract.NFT_name.value = result[0].name
            OneNFTContract.contract_address.value = result[0].token_address
            result.forEach(element => {
                if (element.token_id == route.params.tokenId) {
                    const metadatas = JSON.parse(element.metadata)
                    if (metadatas.image.substring(0, 7) === "ipfs://") {
                        metadatas.image = metadatas.image.substr(7)
                    }
                    OneNFTContract.SingleNFT.name = element.name
                    OneNFTContract.SingleNFT.description = metadatas.description
                    OneNFTContract.SingleNFT.Img = IpfsPreLink.value + metadatas.image
                    OneNFTContract.SingleNFT.TokenId = element.token_id
                    OneNFTContract.SingleNFT.Price = 0.8
                }
            })
        }).then(() => {
            console.log(OneNFTContract)
        })


        const { connect } = useWallet();
        const { balance } = useEthers();
        // Check UserAddress and Balance
        if (window.ethereum) {
            if (window.ethereum.selectedAddress) {
                UserAddress.value = window.ethereum.selectedAddress
                connect("metamask")
                Moapi.BuildContracts(route.params.contract_address)
                    .then((res) => {
                        contracts = res;
                        return contracts;
                    })
                    .then((contracts) => {
                        contracts.TokenContract.methods
                            .getLoginTable(UserAddress.value)
                            .call()
                            .then((res) => {
                                console.log("The login date", res);
                            });
                        contracts.TokenContract.methods
                            .balanceOf(UserAddress.value)
                            .call()
                            .then((res) => {
                                UserTokenBalance.value = res / 10 ** 18;
                            });
                    });
            } else {
                window.ethereum
                    .request({ method: "eth_requestAccounts" })
                    .then((res) => {
                        UserAddress.value = res[0];
                    })
                    .then(() => {
                        connect("metamask")
                        Moapi.BuildContracts(route.params.contract_address)
                            .then((res) => {
                                contracts = res;
                                return contracts;
                            })
                            .then((contracts) => {
                                contracts.TokenContract.methods
                                    .balanceOf(UserAddress.value)
                                    .call()
                                    .then((res) => {
                                        UserTokenBalance.value = res / 10 ** 18;
                                    });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please install Metamask",
                footer: '<a href="https://metamask.io/">Go to Metamask</a>',
            });
        }
        return {
            balance,
            UserAddress,
            UserTokenBalance,
            OneNFTContract,
        }
    },
}
</script>

<style scoped>
.leftcard {
    border: #000 1px solid;
    border-radius: 3rem;
    overflow: hidden;
}

.cardImg {
    object-fit: contain;
}
</style>