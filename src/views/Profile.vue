<template>
	<div class="profile">
		<p v-if="error">{{ error }}</p>

		<div class="container">
			<div class="row">
				<div class="col align-items-center">
					<Avatar :size="200" :colors="colors" class="Heads"/>
				</div>
				<div class="col-sm-12 col-lg-8 text-sm-center text-lg-start fw-bold fs-3">
					<p>Address: {{ shortenAddress(address) }}</p>
					<p>Eth: {{ displayEther(balance) }} ETH</p>
					<p>Token: {{ UserBalance }}</p>
				</div>
			</div>
		</div>

		<div class="m-4 flex-row">
			<div v-if="status === 'connected'">
				<button @click="CheckIn" class="btn btn-outline-primary">簽到</button> |
				<button
					@click="isActivated ? disconnect() : open()"
					class="btn btn-outline-danger"
					:disabled="status === 'connecting'"
				>
					{{
						status === "connected"
							? "Disconnect"
							: status === "connecting"
							? "Connecting..."
							: "Connect"
					}}
				</button>
			</div>
			
			<div v-else>
				<button
					@click="isActivated ? disconnect() : open()"
					class="btn btn-outline-primary flex"
					:disabled="status === 'connecting'"
				>
					{{
						status === "connected"
							? "Disconnect"
							: status === "connecting"
							? "Connecting..."
							: "Connect"
					}}
				</button>
			</div>
		</div>
		<div class="position-relative">
			<hr class="position-absolute top-50 start-50 translate-middle" style="width: 80%;">
		</div>
		<div class="AllOwnedNFT container">
			<div class="row">
				<div class="col-sm-10 col-md-4">
					<div class="input-group mt-3">
						<input type="search" class="form-control" placeholder="NFT Name or Description" aria-label="NFT Name or Description" aria-describedby="button-addon2">
						<button type="button" class="btn btn-primary">
							<i class="fas fa-search"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
		</div>
	<vdapp-board />
</template>

<script>
	import Swal from "sweetalert2";
	import Moapi from "../Moralis/Marolis";
	import BuildContracts from "../Contract/Contract";
	import { ref } from "@vue/reactivity";
	import Avatar from "vue-boring-avatars";
	import {
		useBoard,
		useEthers,
		useWallet,
		displayChainName,
		displayEther,
		shortenAddress,
	} from "vue-dapp";
	import { computed } from '@vue/runtime-core';

	export default {
		name: "Profile",
		components: {
			Avatar,
		},
		setup() {
			var contracts;
			const UserBalance = ref(0);
			const UserAddress = ref("");
			const colors = ref(computed(() => {
				var L = []
				for (var i = 0; i < 5; i++) {
					L.push("#" + UserAddress.value.substr(i * 6, 6))
				}
				return L
			}))
			// Check UserAddress and Balance
			console.log("Address", window.ethereum.selectedAddress)
			if (window.ethereum) {
				window.ethereum
					.request({ method: "eth_requestAccounts" })
					.then((res) => {
						UserAddress.value = res[0];
						console.log(UserAddress);
						console.log("Metamask Checked");
					})
					.then(() => {
						BuildContracts.Contracts()
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
										UserBalance.value = res / 10 ** 18;
									});
							});
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Please install Metamask",
					footer: '<a href="https://metamask.io/">Go to Metamask</a>',
				});
			}

			// Function
			function CheckIn() {
				contracts.TokenContract.methods
					.Login()
					.send({ from: UserAddress.value })
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.log(err);
					});
			}

			function GetAllTokenIds() {
				Moapi.ContractgetAllTokenIds().then((res) => {
					console.log(res);
				});
			}

			const { open } = useBoard();
			const { status, disconnect, error } = useWallet();
			const { address, balance, chainId, isActivated } = useEthers();

			return {
				UserBalance,
				UserAddress,
				contracts,
				CheckIn,
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
				colors,
			};
		},
	};
</script>

<style scoped>
.profile {
	padding: 2% 0 0 0 ;
}

.Heads {
	border-radius: 999rem;
	box-shadow: 0px 0px 1px 8px #cccccc;
}

.AllOwnedNFT {
	padding: 2% 0 0 0;
}
</style>