const Moralis = require('moralis');
const Web3 = require('web3');
const auctionAbi = require('../contractabi/auctionabi.json');
// const tokenAbi = require('../contractabi/tokenabi.json');

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x3F73C573F147895A94D48ABBA1FC1c9EDcA4218a";
// const tokenAddr = "0x1B0aDD45895e5D2d09aaeFEf2E90591C7F0f85db";

Moralis.start({ serverUrl, appId });
var w3 = new Web3(window.ethereum);
var auctionContract = new w3.eth.Contract(auctionAbi, auctionAddr);

async function ContractgetAllTokenIds(contractAddr) {
	const options = { address: contractAddr, chain: "rinkeby" };
	const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
	console.log("ContractgetAllTokenIds", NFTs)
    return NFTs
}
async function getNFTFromAddr(userAddr, contractAddr) {
	const options = {chain:"rinkeby", address:userAddr,token_address:contractAddr}
	const NFTs = await Moralis.Web3API.account.getNFTsForContract(options)
	console.log("getNFTFromAddr", NFTs)
    return NFTs
}

async function getWhiteList(idx) {
    return await auctionContract.methods.whiteList(idx).call();
}

async function getTotalContractNumber() {
    return 1
}

module.exports = {
	ContractgetAllTokenIds,
    getNFTFromAddr,
    getWhiteList,
    getTotalContractNumber
};