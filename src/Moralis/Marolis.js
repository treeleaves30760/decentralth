const Moralis = require('moralis');
const Web3 = require('web3');
const axios = require('axios');
const auctionAbi = require('../contractabi/auctionabi.json');
// const tokenAbi = require('../contractabi/tokenabi.json');

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x9f9f0451670466C7760c0D3FC519573CB0b51518";
// const tokenAddr = "0xa7F84583eecdd796E82b382c9DA7e21AbEE55bb9";

Moralis.start({ serverUrl, appId });
var w3 = new Web3(window.ethereum);
var auctionContract = new w3.eth.Contract(auctionAbi, auctionAddr);

async function ContractgetAllTokenIds(contractAddr) {
	const options = { address: contractAddr, chain: "rinkeby" };
	const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
	// console.log("ContractgetAllTokenIds", NFTs)
    return NFTs
}
async function getNFTFromAddr(userAddr, contractAddr) {
	const options = {chain:"rinkeby", address:userAddr,token_address:contractAddr}
	const NFTs = await Moralis.Web3API.account.getNFTsForContract(options)
	for(let i = 0 ; i < NFTs.total ; i = i + 1){
        NFTs.result[i].metadata = await axios.get(NFTs.result[i].token_uri);
        NFTs.result[i].metadata = JSON.stringify(NFTs.result[i].metadata.data)
        console.log(NFTs.result[i].metadata)
    }
    console.log("getNFTFromAddr", NFTs)
    return NFTs
}

async function getWhiteList(idx) {
    return await auctionContract.methods.whiteList(idx).call();
}

async function getTotalContractNumber() {
    return await auctionContract.methods.getWhiteListLength().call();
}

module.exports = {
	ContractgetAllTokenIds,
    getNFTFromAddr,
    getWhiteList,
    getTotalContractNumber
};