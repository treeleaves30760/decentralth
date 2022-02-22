<template>
	<!-- <div>
        <h1>This Is Profile</h1>
        <button @click="open">Connect</button>
            {{ address }}
        <vdapp-board />
    </div> -->
	<div>
		<p v-if="error">{{ error }}</p>

		<div class="container">
			<div class="row">
				<div class="col">

				</div>
				<div class="col-8 text-sm-center text-lg-start">
					<p>Address: {{ address }}</p>
					<p>Eth: {{ displayEther(balance) }} ETH</p>
					<p>Token: {{ UserBalance }}</p>
					<p>
						network:
						<span class="capitalize">
							{{ displayChainName(chainId) }}
						</span>
					</p>
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
		<!-- <div>
			<div class="AllNFT">
				<button @click="GetAllTokenIds">測試</button>
			</div>
		</div> -->
	</div>
	<vdapp-board />
</template>

<script>
	import Swal from "sweetalert2";
	import Moapi from "../Moralis/Marolis";
	import BuildContracts from "../Contract/Contract";
	import { ref } from "@vue/reactivity";

	import {
		useBoard,
		useEthers,
		useWallet,
		displayChainName,
		displayEther,
		shortenAddress,
	} from "vue-dapp";

	export default {
		name: "Profile",
		setup() {
			var contracts;
			const UserBalance = ref(0);
			const UserAddress = ref("");
			// Check UserAddress and Balance
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
			};
		},
	};
</script>
