<template>
    <div class="container">
        <h1 class="fw-bold">Lottery</h1>
        <div class="row">
            <ul class="nav justify-content-center fs-4 fw-bold">
                <li v-for="NFT in NFT_List" :key="NFT"
                    class="nav-item"
                    @click="changeSelected(NFT.NFT_name)"
                >
                    <a class="nav-link active" :class="{IsSelectItem: Selected == NFT.NFT_name}" @click="UpdateValue(NFT.NFT_name)">{{ NFT.NFT_name }}</a>
                </li>
            </ul>
        </div>
        <hr>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg" :class="ButtonClass" @click="checkTokenRemain">{{ ButtonShowWords }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import Moapi from "../Moralis/Marolis.js"
import { ref, reactive } from "@vue/reactivity"
import { useWallet } from "vue-dapp";
import Swal from "sweetalert2";
export default {
    name: 'Lottery',
    setup() {
        var contracts;
        const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/")
        const NFTContractAddressList = ref([])
        const NFT_List = ref([])
        const Selected = ref("")
        const SelectedNFTValue = ref(0)
        const SelectedNFTAddress = ref("")
        const ButtonShowWords = ref("Choose A NFT")
        const UserTokenBalance = ref(0);
        const UserAddress = ref(""); 
        const TimeValue = ref(0)
        const Getable = ref(0)
        const ButtonClass = reactive({
            'btn-outline-warning': 0,
            'btn-warning': 1,
            'disabled': !Getable.value,
        })
        const { connect } = useWallet();
        const blink = setInterval(() => {
            if (Getable.value) {
                if (TimeValue.value == 0) {
                    TimeValue.value = 1
                    ButtonClass['btn-warning'] = 1
                    ButtonClass['btn-outline-warning'] = 0
                } else {
                    TimeValue.value = 0
                    ButtonClass['btn-warning'] = 0
                    ButtonClass['btn-outline-warning'] = 1
                }
            }
        }, 250)

        function UpdateValue(NFT_name) {
            NFT_List.value.forEach((element) => {
                if (element.NFT_name == NFT_name) {
                    Moapi.getNFTUriLength(element.contract_address).then((res) => {
                        if (res == 0) {
                            Getable.value = 0
                            ButtonClass['disabled'] = 1
                            ButtonShowWords.value = "You Can't Use This"
                        } else {
                            Moapi.getNFTPrice(element.contract_address).then((money) => {
                                SelectedNFTValue.value = money / (10 ** 18)
                                ButtonShowWords.value = "Get A NFT With " + SelectedNFTValue.value + " Token"
                            })
                            SelectedNFTAddress.value = element.contract_address
                            console.log(SelectedNFTAddress.value)
                            Getable.value = 1
                            ButtonClass['disabled'] = 0
                        }
                    })
                }
            })
        }

        if (window.ethereum) {
            if (window.ethereum.selectedAddress) {
                UserAddress.value = window.ethereum.selectedAddress
                connect("metamask")
                Moapi.BuildContracts("NONE")
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
            } else {
                window.ethereum
                    .request({ method: "eth_requestAccounts" })
                    .then((res) => {
                        UserAddress.value = res[0];
                    })
                    .then(() => {
                        connect("metamask")
                        Moapi.BuildContracts("NONE")
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

        Moapi.getTotalContractNumber().then((res) => {
            for (let i = 0; i < res; i++) {
                NFTContractAddressList.value.push(Moapi.getWhiteList(i))
            }
            Promise.all(NFTContractAddressList.value).then(Lists => {
                Lists.forEach(element => {
                    Moapi.ContractgetAllTokenIds(element).then((res) => {
                        return res.result
                    }).then((result) => {
                        // console.log(result)
                        const OneNFTContract = {
                            NFT_name: ref(""),
                            contract_address: ref(0),
                            NFT_totalSupply: reactive([])
                        }
                        OneNFTContract.NFT_name.value = result[0].name
                        OneNFTContract.contract_address.value = result[0].token_address
                        result.forEach(element => {
                            const metadatas = JSON.parse(element.metadata)
                            if (metadatas.image.substring(0, 7) === "ipfs://") {
                                metadatas.image = metadatas.image.substr(7)
                            }
                            const SingleNFT = reactive({
                                name: ref(metadatas.name),
                                description: ref(metadatas.description),
                                Img: ref(IpfsPreLink.value + metadatas.image),
                                TokenId: ref(element.token_id),
                                Price: 0.8,
                            })
                            // console.log(metadatas)
                            OneNFTContract.NFT_totalSupply.push(SingleNFT)
                        })
                        NFT_List.value.push(OneNFTContract)
                    })
                })
            })
        })
        
        function changeSelected(tar) {
            Selected.value = tar
        }

        function shortenWords(Words) {
            if (Words.length < 20) {
                return Words
            } else {
                return Words.substr(15) + "..."
            }
        }

        function checkTokenRemain() {
            if (SelectedNFTValue.value == 0) {
                Swal.fire({
                    title: "Wait a minute!",
                    icon: "info",
                    text: "You operate too fast!"
                })
            } else if (UserTokenBalance.value < SelectedNFTValue.value) {
                Swal.fire({
                    title: "You Don't Have Enough Token",
                    icon: "error",
                    text: "You have " + UserTokenBalance.value + " Token ,but get one " + Selected.value + " need " + SelectedNFTValue.value + " Token",
                })
            } else {
                // console.log(Moapi.storeAddr)
                Moapi.approveToken(SelectedNFTValue.value, Moapi.storeAddr).then(() => {
                    Moapi.getNFT(SelectedNFTAddress.value).then((returnValue) => {
                        console.log("ResUri and TokenIdReturn", returnValue)
                        const Cid = ref(returnValue.ResUri.substr(7))
                        Moapi.getNFTMetadataFromCid(Cid.value).then((res) => {
                            const metadatas = res.data
                            console.log("Metadatas", metadatas)
                            var name = ref(metadatas.name)
                            var description = ref(metadatas.description)
                            var Img = ref(IpfsPreLink.value + metadatas.image)
                            var TokenId = ref(returnValue.Index)
                            Swal.fire({
                                icon: "success",
                                title: "You Get " + name.value,
                                text: description.value,
                                imageUrl: Img.value,
                                imageHeight: 300,
                                html: "<a herf=\"../" + SelectedNFTAddress.value + "/" + TokenId.value + "\"><button class=\"btn btn-outline-primary\">Check NFT</button></a>"
                            })
                        })
                    }).catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Something Wrong",
                            text: error
                        })
                    })
                }).catch((e) => {
                    console.log("Approve part had a ERROR!!", e)
                })
            }
        }

        return {
            IpfsPreLink,
            NFT_List,
            Selected,
            changeSelected,
            shortenWords,
            blink,
            ButtonClass,
            SelectedNFTValue,
            UpdateValue,
            ButtonShowWords,
            checkTokenRemain,
            UserTokenBalance,
            UserAddress,
            SelectedNFTAddress,
        }
    }
}
</script>

<style scoped>
.container{
    padding-top: 5%;
}

.IsSelectItem {
    background-color: #ccc;
}
</style>