<template>
	<div class="profile">
		<p v-if="error">{{ error }}</p>

		<div class="container">
			<div class="row">
				<div class="col align-items-center">
					<Avatar :size="200" :colors="colors" class="Heads"/>
				</div>
				<div class="col-sm-12 col-lg-8 text-sm-center text-lg-start fw-bold fs-3">
					<p>Address: {{ shortenAddress(UserAddress) }}</p>
					<p>Eth: {{ displayEther(balance) }} ETH</p>
					<p>Token: {{ UserTokenBalance }}</p>
				</div>
			</div>
		</div>

			<div class="m-4 flex-row">
				<div v-if="status === 'connected'">
					<button @click="CheckIn()" class="btn btn-outline-primary" :class="CheckInBtnClass">簽到</button> |
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
						v-bind:Price="singleNFT.Price"
						v-bind:Level="singleNFT.Level"
						Button_words="Check"
						class="col-lg-3 col-md-4 col-sm-6"
					/>
				</div>
			</div>
		</div>
	<vdapp-board />
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
	import Avatar from "vue-boring-avatars";
	import NFTCard from "../components/NFT_card.vue"

	export default {
		name: "Profile",
		components: {
			Avatar,
			NFTCard,
		},
		setup() {
			var contracts;
			var CheckInTable;
			const CheckInBtnClass = reactive({
				disabled: true,
			})
			const UserTokenBalance = ref(0);
			const UserAddress = ref("");
			const colors = ref(computed(() => {
				var L = []
				for (var i = 0; i < 5; i++) {
					L.push("#" + UserAddress.value.substr(i * 6, 6))
				}
				return L
			}))
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

			const { open } = useBoard();
			const { status, disconnect, error, connect } = useWallet();
			const { address, balance, chainId, isActivated } = useEthers();

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
								.getLoginTable(UserAddress.value)
								.call()
								.then((res) => {
									// console.log("The login date", res);
									CheckInTable = res;
									CheckInBtnClass.disabled = false
								});
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
										.getLoginTable(UserAddress.value)
										.call()
										.then((res) => {
											// console.log("The login date", res);
											CheckInTable = res;
											CheckInBtnClass.disabled = false
										});
									contracts.TokenContract.methods
										.balanceOf(UserAddress.value)
										.call()
										.then((res) => {
											UserTokenBalance.value = res / 10 ** 18;
										});
								});
						})
						.catch((err) => {
							console.log("Connect error", err);
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

			// Get All NFT of the address
			Moapi.getTotalContractNumber().then((res) => {
				for (let i = 0; i < res; i++) {
					NFTContractAddressList.value.push(Moapi.getWhiteList(i))
				}
				Promise.all(NFTContractAddressList.value).then(Lists => {
					Lists.forEach(element => {
						Moapi.getNFTFromAddr(window.ethereum.selectedAddress, element).then((res) => {
							return res.result
						}).then((result) => {
							// console.log("Try to get the ALL NFT", result)
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
											contract_address: ref(result[0].token_address),
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
										// console.log("SingleNFT",SingleNFT)
										AllNFT.value.push(SingleNFT)
										OneNFTContract.NFT_totalSupply.push(SingleNFT)
									})
								} else {
									const metadatas = JSON.parse(element.metadata)
									if (metadatas.image.substring(0, 7) === "ipfs://") {
										metadatas.image = metadatas.image.substr(7)
									}
									const SingleNFT = reactive({
										contract_address: ref(result[0].token_address),
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
									// console.log("SingleNFT",SingleNFT)
									AllNFT.value.push(SingleNFT)
									OneNFTContract.NFT_totalSupply.push(SingleNFT)
								}

								i = i + 1;
								if (i == 8) {
									i = 0
								}
							})
							// console.log("Single NFT", OneNFTContract)
							NFT_List.value.push(OneNFTContract)
						})
					})
				})
			})

			// Function
			function CheckIn() {
				// console.log("Start CheckIn")
				const Now = new Date();
				const NowMonth = Now.getMonth();
				const NowYear = Now.getFullYear();
				const dates = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				const LastCheckIn = new Date(CheckInTable[Now.getDate()] * 1000);
				const CanCheckIn = ref(true)
				if (Now.getDate() == LastCheckIn.getDate() && NowMonth == LastCheckIn.getMonth()) {
					CanCheckIn.value = false
				}
				var SwalInnerHTML = `
<style> 
	.Checked {
		padding: 3%;
		font-weight: bold;
		background-color: rgba(102, 240, 20, 60%);
		border:#000 2px solid;
	}

	.DateTop {
		border:#ccc 1px solid;
	}

	.NonChecked {
		padding: 3%;
		font-weight: bold;
		background-color: rgba(200, 10, 10, 60%);
	}
	
	.NonTime {
		padding: 3%;
		font-weight: bold;
		background-color: #bbbbbb;
	}

	.NonDate {
		background-color: #bbbbbb;
		font-weight: bold;
	}
</style> ` + 
					"<div class=\"container\"><div class=\"row\">"
				var i = 1;
				for (; i < 8; i++) {
					SwalInnerHTML += "<div class=\"col DateTop\">" + i + "</div>"
				}
				SwalInnerHTML += "</div><div class=\"row\">"
				i = 1
				for (; i <= 35; i++) {
					var ms = CheckInTable[i];
					if (i > dates[NowMonth]) {
						SwalInnerHTML += "<div class=\"col NonTime\"></div>"
					} else {
						const checkDay = new Date(parseInt(ms) * 1000)
						if (checkDay.getMonth() == NowMonth) {
							SwalInnerHTML += "<div class=\"col Checked\">V</div>"
						} else {
							SwalInnerHTML += "<div class=\"col NonChecked\">X</div>"
						}
					}
					if (i % 7 == 0 && i != 35) {
						SwalInnerHTML += "</div><div class=\"row\">"
						for (var j = i; j < i + 7; j++) {
							if (j < dates[NowMonth]) {
								SwalInnerHTML += "<div class=\"col DateTop\">" + (j + 1) + "</div>"
							} else {
								SwalInnerHTML += "<div class=\"col NonDate\"></div>"
							}
						}
						SwalInnerHTML += "</div><div class=\"row\">"
					}
				}
				SwalInnerHTML += "</div></div>"
				Swal.fire({
					title: NowYear + "/" + NowMonth + " Check In Table",
					confirmButtonText: 'Check In',
					showConfirmButton: CanCheckIn.value,
					cancelButtonText: 'Back',
					showCancelButton: true,
					html: SwalInnerHTML,
				}).then((res) => {
					if (res.isConfirmed) {
						contracts.TokenContract.methods
						.Login()
						.send({ from: UserAddress.value })
						.then((res) => {
							console.log("Success Check In", res);
						})
						.catch((err) => {
							console.log("Fail Check In", err);
						});
					}
				})
			}

			function GetAllTokenIds() {
				Moapi.ContractgetAllTokenIds().then((res) => {
					console.log(res);
				});
			}

			function shortenWords(Words) {
				if (Words.length < 20) {
					return Words
				} else {
					return Words.substr(15) + "..."
				}
			}
				
			function ShowSearch() {
				console.log(searchResult)
			}

			return {
				UserTokenBalance,
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
				searchValue,
				searchResult,
				NFT_List,
				AllNFT,
				shortenWords,
				ShowSearch,
				CheckInBtnClass,
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