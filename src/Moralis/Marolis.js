const Moralis = require('moralis');
const Web3 = require('web3');
const axios = require('axios');
const auctionAbi = require('../contractabi/auctionabi.json');
const storeAbi = require('../contractabi/storeabi.json');
const NFTAbi = require("../contractabi/nftabi.json")
const tokenAbi = require("../contractabi/tokenabi.json")
const fusionAbi = require("../contractabi/fusionnftabi.json")
const AuctionAbi = require("../contractabi/auctionabi.json")
const address = window.ethereum.selectedAddress

const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";

const auctionAddr = "0x7DC11A5e5dA6705BBCCc0B564259caEB812770f6";
const storeAddr = "0x7272A3d4Ab19b52951746fEC126bA2553cf52395";
const tokenAddr = "0x2217D0379859905213dFF48087B70db9E72c2cF4";
const fusionAddr = "0xd9d371baeB9D24a0D9a162bBbd13bb7Ab13472e1";

Moralis.start({ serverUrl, appId });
var web3 = new Web3(window.ethereum);
var auctionContract = new web3.eth.Contract(auctionAbi, auctionAddr);
var storeContract = new web3.eth.Contract(storeAbi, storeAddr);
var tokenContract = new web3.eth.Contract(tokenAbi, tokenAddr);
var fusionContract = new web3.eth.Contract(fusionAbi, fusionAddr);
    
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
    for (let i = 0; i < NFTs.total; i = i + 1){
        if (NFTs.result[i].token_uri == null) {   
            if(localStorage.getItem(contractAddr + String(NFTs.result[i].token_id)) != undefined){
                NFTs.result[i].token_uri = localStorage.getItem(contractAddr + String(NFTs.result[i].token_id));
            }else{
                let NFTContract = new web3.eth.Contract(NFTAbi, contractAddr);
                let ResUri = await NFTContract.methods.tokenURI(NFTs.result[i].token_id).call();
                NFTs.result[i].token_uri = "https://cloudflare-ipfs.com/ipfs/" + ResUri.substring(7)
                localStorage.setItem(contractAddr + String(NFTs.result[i].token_id), NFTs.result[i].token_uri);
            }
        }
        if (NFTs.result[i].metadata == null) {
            if(localStorage.getItem(NFTs.result[i].token_uri) != undefined){
                NFTs.result[i].metadata = localStorage.getItem(NFTs.result[i].token_uri)
            }else{
                NFTs.result[i].metadata = await axios.get(NFTs.result[i].token_uri);
                NFTs.result[i].metadata = JSON.stringify(NFTs.result[i].metadata.data)
                localStorage.setItem(NFTs.result[i].token_uri, NFTs.result[i].metadata);
            }
        }
    }
	// console.log("ContractgetAllTokenIds", NFTs)
    return NFTs
}
async function getNFTFromAddr(userAddr, contractAddr) {
	const options = {chain:"rinkeby", address:userAddr,token_address:contractAddr}
	const NFTs = await Moralis.Web3API.account.getNFTsForContract(options)
    // console.log("getNFTFromAddr", NFTs)
    for (let i = 0; i < NFTs.total; i = i + 1){
        if (NFTs.result[i].token_uri == null) {   
            if(localStorage.getItem(contractAddr + String(NFTs.result[i].token_id)) != undefined){
                NFTs.result[i].token_uri = localStorage.getItem(contractAddr + String(NFTs.result[i].token_id));
            }else{
                let NFTContract = new web3.eth.Contract(NFTAbi, contractAddr);
                let ResUri = await NFTContract.methods.tokenURI(NFTs.result[i].token_id).call();
                NFTs.result[i].token_uri = "https://cloudflare-ipfs.com/ipfs/" + ResUri.substring(7)
                localStorage.setItem(contractAddr + String(NFTs.result[i].token_id), NFTs.result[i].token_uri);
            }
        }
        if (NFTs.result[i].metadata == null) {
            if(localStorage.getItem(NFTs.result[i].token_uri) != undefined){
                NFTs.result[i].metadata = localStorage.getItem(NFTs.result[i].token_uri)
            }else{
                NFTs.result[i].metadata = await axios.get(NFTs.result[i].token_uri);
                NFTs.result[i].metadata = JSON.stringify(NFTs.result[i].metadata.data)
                localStorage.setItem(NFTs.result[i].token_uri, NFTs.result[i].metadata);
            }
        }
    }
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

async function getRecipe(cidA, cidB) {
    let cidC =  await fusionContract.methods.getRecipe(cidA, cidB).call();
    if (cidC == "") return "";
    let token_url = "https://cloudflare-ipfs.com/ipfs/" + cidC;
    let Metadata = await axios.get(token_url);
    return JSON.stringify(Metadata);
}

async function fusion(tokenId1, tokenId2) {
    console.log("fusion tokenIds", tokenId1, tokenId2)
    await fusionContract.methods.fusion(tokenId1, tokenId2).send({ from: window.ethereum.selectedAddress, gas: 3500000 });
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
    getRecipe,
    fusion,
};