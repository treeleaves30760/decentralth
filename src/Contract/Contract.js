const web3 = require('web3')

const NFTAbi = require("../contractabi/NFTabi.json")
const TokenAbi = require("../contractabi/tokenabi.json")
const AuctionAbi = require("../contractabi/auctionabi.json")


async function Contracts() {
    const NFTContractAddress = "0x2A26AA5bE62947D6bE159D4D96bE8cf3Abe21A88"
    const TokenContractAddress = "0x1B0aDD45895e5D2d09aaeFEf2E90591C7F0f85db"
    const AuctionContractAddress = "0x3F73C573F147895A94D48ABBA1FC1c9EDcA4218a"

    var w3 = new web3(window.ethereum);
    var NFTContract = new w3.eth.Contract( NFTAbi, NFTContractAddress);
    var TokenContract = new w3.eth.Contract( TokenAbi, TokenContractAddress);
    var AuctionContract = new w3.eth.Contract( AuctionAbi, AuctionContractAddress);

    return {
        NFTContract,
        TokenContract,
        AuctionContract
    }
}

module.exports = {
    Contracts
}