const Moralis = require('moralis');
const Web3 = require('web3');
const axios = require('axios');
const auctionAbi = require('../contractabi/auctionabi.json');
const storeAbi = require('../contractabi/storeabi.json');
const NFTAbi = require("../contractabi/nftabi.json")
const tokenAbi = require("../contractabi/tokenabi.json")
const AuctionAbi = require("../contractabi/auctionabi.json")
const address = window.ethereum.selectedAddress

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x318f7700FDBdA45d0b3032834272029Ca6cdB0Cb";
const storeAddr = "0x98Dd109626f7E2B1CA5C568062b5046D4CA2a518";
const tokenAddr = "0x4a8dCe885e3d027f3e6dD7Bf201C96d4c5A48891";

Moralis.start({ serverUrl, appId });
var web3 = new Web3(window.ethereum);
var auctionContract = new web3.eth.Contract(auctionAbi, auctionAddr);
var storeContract = new web3.eth.Contract(storeAbi, storeAddr);
var tokenContract = new web3.eth.Contract(tokenAbi, tokenAddr);

async function BuildContracts(NFTAddr) {

    var web3 = new Web3(window.ethereum);
    if (NFTAddr != "NONE") {
        var NFTContract = new web3.eth.Contract( NFTAbi, NFTAddr);
    }
    var TokenContract = new web3.eth.Contract( tokenAbi, tokenAddr);
    var AuctionContract = new web3.eth.Contract( AuctionAbi, auctionAddr);

    return {
        NFTContract,
        TokenContract,
        AuctionContract
    }
}

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
        // console.log(NFTs.result[i].metadata)
    }
    // console.log("getNFTFromAddr", NFTs)
    return NFTs
}

async function getWhiteList(idx) {
    return await auctionContract.methods.whiteList(idx).call();
}

async function getTotalContractNumber() {
    return await auctionContract.methods.getWhiteListLength().call();
}

async function approveToken(num, contractAddress) {
    await tokenContract.methods.approve(contractAddress, web3.utils.toBN(num * 10 ** 18)).send({ from: window.ethereum.selectedAddress, gas: 3500000 });
}

async function getNFT(contractAddress) { // Lottery get, use after approve token
    console.log(window.ethereum.selectedAddress)
    await storeContract.methods.getNFT(contractAddress).send({ from: window.ethereum.selectedAddress, gas: 3500000 });
    let NFTContract = new web3.eth.Contract(NFTAbi, contractAddress);
    let userNum = await NFTContract.methods.balanceOf(address).call();
    let Index = await NFTContract.methods.tokenOfOwnerByIndex(address, userNum - 1).call();
    let ResUri = await NFTContract.methods.tokenURI(Index).call();
    return {ResUri, Index}
}

async function getNFTPrice(contractAddress) {
    return await storeContract.methods.getPrice(contractAddress).call();
}

async function getNFTUriLength(contractAddress) {
    return await storeContract.methods.getNFTUriLength(contractAddress).call();
}

async function getNFTUri(contractAddress, id) {
    return await storeContract.methods.getNFTUri(contractAddress, id).call();
}

async function getNFTMetadataFromCid(Cid) {
    return await axios.get("https://cloudflare-ipfs.com/ipfs/" + Cid);
}

async function getNFTMetadataFromTokenUri(Uri) {
    return await axios.get(Uri);
}

module.exports = {
	ContractgetAllTokenIds,
    getNFTFromAddr,
    getWhiteList,
    getTotalContractNumber,
    BuildContracts,
    approveToken,
    getNFT,
    getNFTPrice,
    getNFTUri,
    getNFTUriLength,
    storeAddr,
    getNFTMetadataFromCid,
    getNFTMetadataFromTokenUri,
};