import Moapi from "../Moralis/Marolis.js";
import { ref, reactive } from "@vue/reactivity";

const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/");
const NFTContractAddressList = ref([]);
const AllNFT = ref([])
const NFT_List = ref([])

Moapi.getTotalContractNumber().then((res) => {
    for (let i = 0; i < res; i++) {
        NFTContractAddressList.value.push(Moapi.getWhiteList(i))
    }
    Promise.all(NFTContractAddressList.value).then(Lists => {
        Lists.forEach(element => {
            Moapi.getNFTFromAddr(window.ethereum.selectedAddress, element).then((res) => {
                return res.result
            }).then((result) => {
                // console.log("Try to get the ALL NFT")
                const OneNFTContract = {
                    NFT_name: ref(result[0].name),
                    contract_address: ref(result[0].token_address),
                    NFT_totalSupply: reactive([])
                }
                let i = 0;
                result.forEach(element => {
                    if (!element.metadata) {
                        Moapi.getNFTMetadataFromTokenUri(element.TokenId).then((metadataReturn) => {
                            element.metadata = metadataReturn
                            const metadatas = JSON.parse(element.metadata)
                            if (metadatas.image.substring(0, 7) === "ipfs://") {
                                metadatas.image = metadatas.image.substr(7)
                            }
                            const SingleNFT = reactive({
                                name: ref(metadatas.name),
                                description: ref(metadatas.description),
                                Img: ref(IpfsPreLink.value + metadatas.image),
                                TokenId: ref(element.token_id),
                                Level: i,
                                Price: 0.8,
                            })
                            if (metadatas.attributes) {
                                metadatas.attributes.forEach((objects) => {
                                    SingleNFT[objects.trait_type] = objects.value
                                })
                            }
                            console.log("SingleNFT",SingleNFT)
                            AllNFT.value.push(SingleNFT)
                            OneNFTContract.NFT_totalSupply.push(SingleNFT)
                        })
                    } else {
                        const metadatas = JSON.parse(element.metadata)
                        if (metadatas.image.substring(0, 7) === "ipfs://") {
                            metadatas.image = metadatas.image.substr(7)
                        }
                        const SingleNFT = reactive({
                            name: ref(metadatas.name),
                            description: ref(metadatas.description),
                            Img: ref(IpfsPreLink.value + metadatas.image),
                            TokenId: ref(element.token_id),
                            Level: i,
                            Price: 0.8,
                        })
                        if (metadatas.attributes) {
                            metadatas.attributes.forEach((objects) => {
                                SingleNFT[objects.trait_type] = objects.value
                            })
                        }
                        console.log("SingleNFT",SingleNFT)
                        AllNFT.value.push(SingleNFT)
                        OneNFTContract.NFT_totalSupply.push(SingleNFT)
                    }

                    i = i + 1;
                    if (i == 8) {
                        i = 0
                    }
                })
                console.log("Single NFT", OneNFTContract)
                NFT_List.value.push(OneNFTContract)
            })
        })
    })
})

module.exports = {
    NFTContractAddressList,
    AllNFT,
    NFT_List,
}