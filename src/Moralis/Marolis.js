const Moralis = require('moralis');
const Web3 = require('web3');
const axios = require('axios');
const auctionAbi = require('../contractabi/auctionabi.json');
const NFTAbi = require("../contractabi/NFTabi.json")
const TokenAbi = require("../contractabi/tokenabi.json")
const AuctionAbi = require("../contractabi/auctionabi.json")
// const tokenAbi = require('../contractabi/tokenabi.json');

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x3596C4B6f60eA512EB3dF9Aa80783C8E86ef14A1";
const tokenAddr = "0xdCF18Bf048F9594cf662305b0Cc0895cB8BaAD53";

Moralis.start({ serverUrl, appId });
var w3 = new Web3(window.ethereum);
var auctionContract = new w3.eth.Contract(auctionAbi, auctionAddr);

async function BuildContracts(NFTAddr) {

    var w3 = new Web3(window.ethereum);
    if (NFTAddr != "NONE") {
        var NFTContract = new w3.eth.Contract( NFTAbi, NFTAddr);
    }
    var TokenContract = new w3.eth.Contract( TokenAbi, tokenAddr);
    var AuctionContract = new w3.eth.Contract( AuctionAbi, auctionAddr);

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
    getTotalContractNumber,
    BuildContracts
};