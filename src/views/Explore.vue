<template>
    <div class="Explore container-fluid">
        <h1 class="ExploreName"><b>Explore</b></h1>
        <div class="row">
            <ul class="nav justify-content-center fs-4 fw-bold">
                <li class="nav-item" @click="changeSelected('All')"> 
                    <a class="nav-link active">All</a> 
                </li>
                <li v-for="NFT in NFT_List" :key="NFT"
                    class="nav-item"
                    @click="changeSelected(NFT.NFT_name)"
                >
                    <a class="nav-link active">{{ NFT.NFT_name }}</a>
                </li>
            </ul>
        </div>
        <div class="row">
            <div class="col">
                <div class="Single_NFT container">
                <div 
                    v-for="NFT in NFT_List" 
                    :key="NFT"
                >
                    <div v-if="NFT.NFT_name == Selected || Selected == 'All'">
                        <h1>{{NFT.NFT_name}}</h1>
                        <div>
                            <div class="Sell_List row g-2">
                                <NFTCard v-for="singleNFT in NFT.NFT_totalSupply" :key="singleNFT" 
                                    v-bind:Description="shortenWords(singleNFT.description)" 
                                    v-bind:ImgURL="singleNFT.Img" 
                                    v-bind:Name="singleNFT.name" 
                                    v-bind:TokenId="singleNFT.TokenId" 
                                    v-bind:Contract_address="NFT.contract_address"
                                    v-bind:Price="singleNFT.Price"
                                    Button_words="Buy Now!"
                                    class="SellCard"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import Moapi from "../Moralis/Marolis"
import NFTCard from "../components/NFT_card.vue"

export default {
    name: 'Explore',
    components: {
        NFTCard,
    },
    setup() {
        const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/")
        const NFTContractAddressList = ref([])
        const NFT_List = ref([])
        const Selected = ref("All")

        Moapi.getTotalContractNumber().then((res) => {
            for (let i = 0; i < res; i++) {
                NFTContractAddressList.value.push(Moapi.getWhiteList(i))
            }
            Promise.all(NFTContractAddressList.value).then(Lists => {
                Lists.forEach(element => {
                    Moapi.ContractgetAllTokenIds(element).then((res) => {
                        return res.result
                    }).then((result) => {
                        console.log(result)
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
                                name: ref(element.name),
                                description: ref(metadatas.description),
                                Img: ref(IpfsPreLink.value + metadatas.image),
                                TokenId: ref(element.token_id),
                                Price: 0.8,
                            })
                            console.log(metadatas)
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
        }
    }
}
</script>

<style>
.Explore {
    margin-top: 3rem;
}

.ExploreName {
    font-size: 4rem;
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.Sell_List {
    margin: 5%;
    width: 100%;
    display: flex;
}

.Single_NFT {
    height: 100rem;
}

</style>