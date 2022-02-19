<template>
    <!-- <div>
        <h1>This Is Profile</h1>
        <button @click="open">Connect</button>
            {{ address }}
        <vdapp-board />
    </div> -->
    <div>
        <p v-if="error">{{ error }}</p>

        <div v-if="isActivated">
        <p>{{ shortenAddress(address) }}</p>
        <p>{{ displayEther(balance) }} ETH</p>
        <p>
            network:
            <span class="capitalize">
            {{ displayChainName(chainId) }}
            </span>
        </p>
        </div>

        <div class="m-4">
        <button
            
            @click="isActivated ? disconnect() : open()"
            class="btn btn-outline-primary"
            :disabled="status === 'connecting'"
        >
            {{
            status === 'connected'
                ? 'Disconnect'
                : status === 'connecting'
                ? 'Connecting...'
                : 'Connect'
            }}
        </button>
        <button
            v-if="status === 'connected'"
            @click="isActivated ? disconnect() : open()"
            class="btn btn-outline-danger"
            :disabled="status === 'connecting'"
        >
            {{
            status === 'connected'
                ? 'Disconnect'
                : status === 'connecting'
                ? 'Connecting...'
                : 'Connect'
            }}
        </button>
        </div>
        <div>
            <div>
                Balance {{ UserBalance }} NTtoken
            </div>
            <div class="CheckInPart">
                <button @click="CheckIn">簽到</button>
            </div>
        </div>
    </div>
    <vdapp-board />
</template>

<script>
import web3 from 'web3'
import Swal from 'sweetalert2'
import NFTAbi from "../contractabi/NFTabi.json"
import TokenAbi from "../contractabi/tokenabi.json"
import AuctionAbi from "../contractabi/auctionabi.json"
import Moralis from 'moralis'

import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'
import { ref } from '@vue/reactivity'
const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";
Moralis.start({ serverUrl, appId });
const options = { address: "0x2A26AA5bE62947D6bE159D4D96bE8cf3Abe21A88", chain: "rinkeby" };
async function getNFT() {
	const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
	console.log(NFTs)
}
async function BuildContracts () {
    const NFTContractAddress = "0x2A26AA5bE62947D6bE159D4D96bE8cf3Abe21A88"
    const TokenContractAddress = "0x1B0aDD45895e5D2d09aaeFEf2E90591C7F0f85db"
    const AuctionContractAddress = "0x3F73C573F147895A94D48ABBA1FC1c9EDcA4218a"

    var w3 = new web3(window.ethereum);
    var NFTContract = new w3.eth.Contract( NFTAbi, NFTContractAddress);
    var TokenContract = new w3.eth.Contract( TokenAbi, TokenContractAddress);
    var AuctionContract = new w3.eth.Contract( AuctionAbi, AuctionContractAddress);

    return {
        NFTContract,
        TokenContract,
        AuctionContract
    }
}

export default {
    name: 'Profile',
    setup() {
        var contracts
        const UserBalance = ref(0)
        const UserAddress = ref("")
        getNFT().then(console.log)
        // Check UserAddress and Balance
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((res) => {
                UserAddress.value = res[0]
                console.log(UserAddress)
                console.log("Metamask Checked")
            }).then(() => {
                BuildContracts().then((res) => {
                    contracts = res
                    console.log(contracts)
                    return contracts
                }).then((contracts) => {
                    contracts.TokenContract.methods.getLoginTable(UserAddress.value).call().then(res=>{
                        console.log(res)
                        console.log(res[18],res[19],res[20])
                    });
                    contracts.TokenContract.methods.balanceOf(UserAddress.value).call().then((res) => {
                        UserBalance.value = res / (10**18)
                        console.log(res)
                        console.log(UserBalance)
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

        // Function
        function CheckIn() {
            contracts.TokenContract.methods.Login().send({from:UserAddress.value}).then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        }

        const { open } = useBoard()
        const { status, disconnect, error } = useWallet()
        const { address, balance, chainId, isActivated } = useEthers()

        return {
            UserBalance,
            UserAddress,
            contracts,
            CheckIn,
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
        }
    },
}
</script>