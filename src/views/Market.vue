<template>
    <div>
        <h1>This is Market</h1>
        <div class="Sell_List flex">
            <div v-for="NFT in NFT_list" :key="NFT" class="NFT_card flex">
                <img v-bind:src="NFT.Img" v-bind:alt="NFT.Img" class="NFT_img">
                <h1>Name {{NFT.name}}</h1>
                <div> 
                    Description   
                    <p>{{NFT.description}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Market',
    components: {

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
        const NFT_list = [
            {
                name: "Test01",
                description: "This is Test01",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/p843x403/270280073_1964539197052462_7541759068172180095_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=0pjaKPYaUckAX91SgMR&_nc_ht=scontent-tpe1-1.xx&oh=00_AT8iDwmdo6-TSbax60lt0zXNQSWMgB4-e23LG0POGWaH4g&oe=62142984",
            },
            {
                name: "Test02",
                description: "This is Test02",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/246126724_1907267179446331_6921007638215103985_n.jpg?stp=dst-jpg_s960x960&_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=c-iXjU1naPgAX_U3KkD&tn=bbtB4EGj133oFi2J&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-eJkG9dpo4WsAI2YS6_-h_OV3n_oV8cStskSMvIdeJ0g&oe=62129DC9"
            },
            {
                name: "Test03",
                description: "This is Test03",
                Img: "https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/252831044_1923899414449774_5825512805262706142_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=JHv25HYLwdYAX9y9ptf&_nc_ht=scontent-tpe1-1.xx&oh=00_AT-f1lyCYAFAqU81V3p5_B3GMThoe8FCKx4TprtZELiNKQ&oe=62137A94",
            },
        ]

        return {
            NFT_list,
        }
    }
}
</script>

<style>
.NFT_img {
    width: 30%;
}
.NFT_card {
    width: 25%;
}
</style>