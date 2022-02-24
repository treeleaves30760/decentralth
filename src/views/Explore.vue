<template>
    <div class="Explore container">
        <h1 class="ExploreName"><b>Explore</b></h1>
        <div class="row">
            <div class="col-2">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">NFT系列選擇</h5>
                        <div class="btn-group-vertical">
                            <button 
                                type="button" 
                                class="btn btn-outline-secondary"
                                @click="changeSelected('All')"
                            >
                                顯示全部
                            </button>
                            <button 
                                v-for="NFT in NFT_List" 
                                :key="NFT" 
                                @click="changeSelected(NFT.NFT_name)"
                                type="button" 
                                class="btn btn-outline-secondary"
                            >
                                {{ NFT.NFT_name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="Single_NFT container">
                <div 
                    v-for="NFT in NFT_List" 
                    :key="NFT"
                >
                    <div v-if="NFT.NFT_name == Selected || Selected == 'All'">
                        <h1>{{NFT.NFT_name}}</h1>
                        <p @click="Check">Contract Address: {{ NFT.contract_address }}</p>
                        <div>
                            <div class="Sell_List row">
                                <NFTCard v-for="singleNFT in NFT.NFT_totalSupply" :key="singleNFT" 
                                    v-bind:Description="singleNFT.description" 
                                    v-bind:ImgURL="singleNFT.Img" 
                                    v-bind:Name="singleNFT.name" 
                                    v-bind:TokenId="singleNFT.TokenId" 
                                    v-bind:Contract_address="NFT.contract_address"
                                    v-bind:Price="singleNFT.Price"
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
        const NFT_List = ref([])
        const Selected = ref("")

        Moapi.ContractgetAllTokenIds().then((res) => {
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
        }).then(() => {
            Selected.value = NFT_List.value[0].NFT_name
        })

        function changeSelected(tar) {
            Selected.value = tar
        }

        return {
            IpfsPreLink,
            NFT_List,
            Selected,
            changeSelected,
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