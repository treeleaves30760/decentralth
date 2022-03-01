const Moralis = require('moralis');
const Web3 = require('web3');
const axios = require('axios');
const auctionAbi = require('../contractabi/auctionabi.json');
const storeAbi = require('../contractabi/storeabi.json');
const NFTAbi = require("../contractabi/nftabi.json");
const tokenAbi = require("../contractabi/tokenabi.json")

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x68e7F78457edDa5BfA4803c4e2Aa063AFE8a4274";
const storeAddr = "0x4b275E9061fBF4Fb64DD568758edDa6543bc858C";
const tokenAddr = "0xea95dDcc8cb2D57A813477073Ab89DDC5D3A8854";

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
    var AuctionContract = new web3.eth.Contract( auctionAbi, auctionAddr);

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

async function approveToken(num, address) {
    await tokenContract.methods.approve(address, web3.utils.toBN(num * 10 ** 18)).send({ from: address, gas: 3500000 });
}

async function getNFT(address) {
    await storeContract.methods.getNFT(address).send({ from: address, gas: 3500000 });
}

async function getNFTPrice(address) {
    return await storeContract.methods.NFTList(address).call();
}

async function getNFTUri(address, id) {
    return await storeContract.methods.getNFTUri(address, id).call();
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
};