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
            class="btn"
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
    </div>
    <vdapp-board />
</template>

<script>
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
} from 'vue-dapp'

export default {
    name: 'Profile',
    setup() {
        if (window.ethereum) {
            window.ethereum.enable().then((res) => {
                console.log(res)
                console.log("Metamask Checked")
            })
        } else {
            alert("Please install Metamask")
        }

        const { open } = useBoard()
        const { status, disconnect, error } = useWallet()
        const { address, balance, chainId, isActivated } = useEthers()

        return { 
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