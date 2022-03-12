<template>
    <div class="container p-2">
        <div class="row">
            <NFTCard
                v-bind:Description="shortenWords(NFT1.description)" 
                v-bind:ImgURL="NFT1.Img" 
                v-bind:Name="NFT1.name" 
                v-bind:TokenId="NFT1.TokenId" 
                v-bind:Contract_address="NFT1.contract_address"
                v-bind:Level="NFT1.Level"
                class="col"
            />
            <div class="col bigPlus align-self-center">+</div>
            <NFTCard
                v-bind:Description="shortenWords(NFT2.description)" 
                v-bind:ImgURL="NFT2.Img" 
                v-bind:Name="NFT2.name" 
                v-bind:TokenId="NFT2.TokenId" 
                v-bind:Contract_address="NFT2.contract_address"
                v-bind:Level="NFT2.Level"
                class="col"
            />
        </div>
        <div class="row">
            <div class="col" :class="{ChoosePart: ChooseNFT == 1}">
                <button class="btn btn-outline-success btn-lg m-4" @click="ChangeChooseNFTTo1">Choose NFT1</button>
            </div>
            <div class="col">
                <button class="btn btn-outline-primary btn-lg m-4" @click="CheckFusionNFT">Check Fusion!</button>
            </div>
            <div class="col" :class="{ChoosePart: ChooseNFT == 2}">
                <button class="btn btn-outline-success btn-lg m-4" @click="ChangeChooseNFTTo2">Choose NFT2</button>
            </div>
        </div>
        <div class="position-relative p-4">
            <hr class="position-absolute top-50 start-50 translate-middle" style="width: 80%;">
        </div>
        <div class="AllOwnedNFT container">
            <div class="row mb-4">
                <div class="col-sm-10 col-md-4">
                    <div class="input-group mt-3">
                        <input 
                            v-model="searchValue"
                            type="search"
                            class="form-control" 
                            placeholder="NFT Name or Description" 
                            aria-label="NFT Name or Description" 
                            aria-describedby="button-addon2"
                        >
                        <button type="button" class="btn btn-primary" @click="ShowSearch()">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="row">
                <NFTCard
                    v-for="singleNFT in searchResult" :key="singleNFT"
                    v-bind:Description="shortenWords(singleNFT.description)" 
                    v-bind:ImgURL="singleNFT.Img" 
                    v-bind:Name="singleNFT.name" 
                    v-bind:TokenId="singleNFT.TokenId" 
                    v-bind:Contract_address="singleNFT.contract_address"
                    v-bind:Level="singleNFT.Level"
                    Button_words="Check"
                    @click="UpdateChooseNFTTokenId(singleNFT)"
                    class="col-lg-3 col-md-4 col-sm-6"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import Moapi from "../Moralis/Marolis";
import { ref, reactive } from "@vue/reactivity";
import {
    useBoard,
    useEthers,
    useWallet,
    displayChainName,
    displayEther,
    shortenAddress,
} from "vue-dapp";
import { computed } from '@vue/runtime-core';
import NFTCard from "../components/NFT_card.vue"

export default {
    name: "Profile",
    components: {
        NFTCard,
    },
    setup() {
        var contracts;
        const UserTokenBalance = ref(0);
        const UserAddress = ref("");
        const LevelWordList = (["G", "F", "E", "D", "C", "B", "A", "S", "SS"])
        const AllNFT = ref([])
        const searchValue = ref("")
        const searchResult = ref(computed(() => {
            return AllNFT.value.filter((singleNFT) => {
                return (singleNFT.name.includes(searchValue.value) || singleNFT.description.includes(searchValue.value) || LevelWordList[singleNFT.Level] == searchValue.value)
            })
        }))
        const IpfsPreLink = ref("https://cloudflare-ipfs.com/ipfs/")
        const NFTContractAddressList = ref([])
        const NFT_List = ref([])
        const FusionAddress = "0xd9d371baeB9D24a0D9a162bBbd13bb7Ab13472e1".toLowerCase();

        const { open } = useBoard();
        const { status, disconnect, error, connect } = useWallet();
        const { address, balance, chainId, isActivated } = useEthers();

        const ChooseNFT = ref(-1)
        const NFT1 = ref({})
        const NFT2 = ref({})

        // Check UserAddress and Balance
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
                        console.log("Connect error:", err);
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
                    Moapi.getNFTFromAddr(window.ethereum.selectedAddress, element).then((res) => {
                        return res.result
                    }).then((result) => {
                        if (result[0].token_address == FusionAddress) {
                            const OneNFTContract = {
                                NFT_name: ref(result[0].name),
                                contract_address: ref(result[0].token_address),
                                NFT_totalSupply: reactive([])
                            }
                            let i = 0;
                            result.forEach(element => {
                                const metadatas = JSON.parse(element.metadata)
                                if (metadatas.image.substring(0, 7) === "ipfs://") {
                                    metadatas.image = metadatas.image.substr(7)
                                }
                                let Cid = element.token_uri.split("/")
                                Cid = Cid[Cid.length - 1]
                                const SingleNFT = reactive({
                                    name: ref(metadatas.name),
                                    description: ref(metadatas.description),
                                    Img: ref(IpfsPreLink.value + metadatas.image),
                                    TokenId: ref(element.token_id),
                                    contract_address: ref(result[0].token_address),
                                    Level: i,
                                    cid: ref(Cid),
                                    Price: 0.8,
                                })
                                if (metadatas.attributes) {
                                    metadatas.attributes.forEach((objects) => {
                                        SingleNFT[objects.trait_type] = objects.value
                                    })
                                }

                                i = i + 1;
                                if (i == 8) {
                                    i = 0
                                }

                                AllNFT.value.push(SingleNFT)
                                OneNFTContract.NFT_totalSupply.push(SingleNFT)
                            })
                            // console.log("Single NFT", OneNFTContract)
                            NFT_List.value.push(OneNFTContract)
                        } else {
                            // console.log(result[0].token_address);
                        }
                    })
                })
            })
        })

        // Function

        function GetAllTokenIds() {
            // Moapi.ContractgetAllTokenIds().then((res) => {
            //     // console.log(res);
            // });
        }

        function shortenWords(Words) {
            if (Words) {
                if (Words.length < 20) {
                        return Words
                } else {
                    return Words.substr(15) + "..."
                }
            }
        }
            
        function ShowSearch() {
            console.log(searchResult)
        }

        function ChangeChooseNFTTo1() {
            ChooseNFT.value = 1;
            // console.log("Change to 1");
        }

        function ChangeChooseNFTTo2() {
            ChooseNFT.value = 2;
            // console.log("Change to 2");
        }

        function UpdateChooseNFTTokenId(GetNFT) {
            if (ChooseNFT.value == 1) {
                if (NFT2.value == GetNFT) {
                    Swal.fire({
                        icon: "warning",
                        title: "You Can't Choose Same NFT!"
                    })
                } else {
                    NFT1.value = GetNFT
                    // console.log("Change NFT1 to ", NFT1.value)
                }
            } else if (ChooseNFT.value == 2) {
                if (NFT1.value == GetNFT) {
                    Swal.fire({
                        icon: "warning",
                        title: "You Can't Choose Same NFT!"
                    })
                } else {
                    NFT2.value = GetNFT
                    // console.log("Change NFT2 to ", NFT2.value)
                }
            }
        }

        function CheckFusionNFT() {
            console.log("NFTs", NFT1, NFT2)
            Moapi.getRecipe(NFT1.value.cid, NFT2.value.cid).then((res) => {
                if (res == "") {
                    Swal.fire({
                        icon: "error",
                        title: "There is no recipe for two NFTs"
                    })
                } else {
                    const metadatas = JSON.parse(res).data
                    // console.log("metadatas", metadatas)
                    if (metadatas.image.substring(0, 7) === "ipfs://") {
                        metadatas.image = metadatas.image.substr(7)
                    }
                    Swal.fire({
                        icon: "info",
                        title: metadatas.name,
                        imageUrl: "https://cloudflare-ipfs.com/ipfs/" + metadatas.image,
                        imageHeight: 100,
                        confirmButtonText: "Fusion!",
                        cancelButtonText: 'Back',
                        showCancelButton: true,
                        showCloseButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Moapi.fusion(NFT1.value.TokenId, NFT2.value.TokenId).then(() => {
                                Swal.fire({
                                    icon: "success",
                                    title: "Success!" 
                                })
                            }).catch((e) => {
                                console.log("Fusion Error", e)
                                Swal.fire({
                                    icon: "error",
                                    title: "Error!",
                                    text: e, 
                                })
                            })
                        }
                    })
                }
                
            })
            
        }

        return {
            UserTokenBalance,
            UserAddress,
            contracts,
            GetAllTokenIds,
            open,
            status,
            disconnect,
            error,
            address,
            balance,
            chainId,
            isActivated,
            displayChainName,
            displayEther,
            shortenAddress,
            searchValue,
            searchResult,
            NFT_List,
            AllNFT,
            shortenWords,
            ShowSearch,
            ChangeChooseNFTTo1,
            ChangeChooseNFTTo2,
            CheckFusionNFT,
            NFT1,
            NFT2,
            ChooseNFT,
            UpdateChooseNFTTokenId,
        };
    }
}
</script>

<style>
.bigPlus {
    font-size: 10rem;
}

.ChoosePart {
    background-color: rgba(25, 135, 84, 10%);
}
</style>