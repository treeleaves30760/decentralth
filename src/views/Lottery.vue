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
                <button class="btn btn-lg" :class="ButtonClass">{{ ButtonShowWords }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import Moapi from "../Moralis/Marolis.js"
import { ref, reactive } from "@vue/reactivity"
export default {
    name: 'Lottery',
    setup() {
        const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/")
        const NFTContractAddressList = ref([])
        const NFT_List = ref([])
        const Selected = ref("")
        const SelectedNFTValue = ref(0)
        const ButtonShowWords = ref("Choose A NFT")
        function UpdateValue(NFT_name) {
            let ind = 0;
            NFT_List.value.forEach((element) => {
                if (element.NFT_name == NFT_name) {
                    Moapi.getNFTPrice(element.contract_address).then((res) => {
                        if (res == 0) {
                            Getable.value = 0
                            ButtonClass['disabled'] = 1
                            ButtonShowWords.value = "You Can't Use This"
                        } else {
                            Getable.value = 1
                            SelectedNFTValue.value = res / (10 ** 18)
                            ButtonClass['disabled'] = 0
                            ButtonShowWords.value = "Get A NFT With " + SelectedNFTValue.value + " Token"
                        }
                    })
                } else {
                    ind = ind + 1
                }
            })
        }
        const TimeValue = ref(0)
        const Getable = ref(0)
        const ButtonClass = reactive({
            'btn-outline-warning': 0,
            'btn-warning': 1,
            'disabled': !Getable.value,
        })

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
            ButtonShowWords
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