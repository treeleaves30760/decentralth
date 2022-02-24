const Moralis = require('moralis');

async function ContractgetAllTokenIds(InputAddress = "0x2A26AA5bE62947D6bE159D4D96bE8cf3Abe21A88") {
    const serverUrl = "https://q35jbv5jagyw.usemoralis.com:2053/server";
    const appId = "1kfWR1GvtpZwlXDhJ3sG1Fv9twJzjZ3zcn2DkBjq";
    Moralis.start({ serverUrl, appId });
    const options = { address: InputAddress, chain: "rinkeby" };
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    return NFTs
}

module.exports = {
    ContractgetAllTokenIds,
}