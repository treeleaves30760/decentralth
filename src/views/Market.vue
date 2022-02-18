<template>
    <div>
        <h1>Market</h1>
        <div class="Single_NFT">
            <div v-for="NFT in NFT_List" :key="NFT">
                <h1>{{NFT.name}}</h1>
                <p>{{NFT.contract_address}}</p>
                <div class="Sell_List">
                    <NFTCard v-for="singleNFT in NFT.NFT_totalSupply" :key="singleNFT" 
                    v-bind:Description="singleNFT.description" 
                    v-bind:ImgURL="singleNFT.Img" 
                    v-bind:Name="singleNFT.name" 
                    v-bind:TokenId="singleNFT.TokenId" 
                    v-bind:Contract_address="NFT.contract_address" />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import NFTCard from "../components/NFT_card.vue"
export default {
    name: 'Market',
    components: {
        NFTCard,
    },
    setup() {
        if (window.ethereum) {
            window.ethereum.enable().then((res) => {
                console.log(res)
                console.log("Metamask Checked")
            })
        } else {
            alert("Please install Metamask")
        }
        const NFT_List = []

        const One_NFT = {
            NFT_name: "Test NFT",
            contract_address: "0x00000000000000001",
            NFT_totalSupply: [
                {
                    name: "Test01",
                    description: "This is Test01",
                    Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/p843x403/245599100_1906974256142290_559860839121382224_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=Z3FPsmtz_woAX8c69Gl&_nc_ht=scontent-tpe1-1.xx&oh=00_AT9hBqXinwnR_4rSqYCjFzMPMWaC1KJkZOmIRdxSP2j1-w&oe=62125F03",
                    TokenId: 1,
                },
                {
                    name: "Test02",
                    description: "This is Test02",
                    Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/246126724_1907267179446331_6921007638215103985_n.jpg?stp=dst-jpg_s960x960&_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=c-iXjU1naPgAX_U3KkD&tn=bbtB4EGj133oFi2J&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-eJkG9dpo4WsAI2YS6_-h_OV3n_oV8cStskSMvIdeJ0g&oe=62129DC9",
                    TokenId: 2,
                },
                {
                    name: "Test03",
                    description: "This is Test03",
                    Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/252831044_1923899414449774_5825512805262706142_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=JHv25HYLwdYAX9y9ptf&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-f1lyCYAFAqU81V3p5_B3GMThoe8FCKx4TprtZELiNKQ&oe=62137A94",
                    TokenId: 3,
                },
            ]
        }
        NFT_List.push(One_NFT)

        const NFT_list = [
            {
                name: "Test01",
                description: "This is Test01",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/p843x403/245599100_1906974256142290_559860839121382224_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=Z3FPsmtz_woAX8c69Gl&_nc_ht=scontent-tpe1-1.xx&oh=00_AT9hBqXinwnR_4rSqYCjFzMPMWaC1KJkZOmIRdxSP2j1-w&oe=62125F03",
                TokenId: 0x000000000000000000001,
            },
            {
                name: "Test02",
                description: "This is Test02",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/246126724_1907267179446331_6921007638215103985_n.jpg?stp=dst-jpg_s960x960&_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=c-iXjU1naPgAX_U3KkD&tn=bbtB4EGj133oFi2J&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-eJkG9dpo4WsAI2YS6_-h_OV3n_oV8cStskSMvIdeJ0g&oe=62129DC9",
                TokenId: 0x000000000000000000001,
            },
            {
                name: "Test03",
                description: "This is Test03",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/252831044_1923899414449774_5825512805262706142_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=JHv25HYLwdYAX9y9ptf&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-f1lyCYAFAqU81V3p5_B3GMThoe8FCKx4TprtZELiNKQ&oe=62137A94",
                TokenId: 0x000000000000000000001,
            },
        ]

        return {
            NFT_list,
            NFT_List,
            One_NFT,
        }
    }
}
</script>

<style>
.Sell_List {
    margin: 5%;
    display: flex;
}

NFTCard {
    display: flex;
    width: 20%;
}
</style>