<template>
    <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card d-flex ">
            <div class="imgPart ratio ratio-1x1">
                <div class="container"> 
                    <img v-bind:src="imgURL" v-bind:alt="name" class="card-img-top">
                </div>
            </div>
            <hr>
            <div class="card-body">
                <div class="info">
                    <h5 class="card-title">
                        Name {{name}}
                    </h5>
                    <p class="card-text">
                        {{description}}
                    </p>
                </div>
                <div class="NFT_price">
                    Price: {{price}} NTtoken
                </div>
                <hr>
                <router-link :to="link"><button class="toBuy btn btn-outline-primary">{{ button_words }}</button></router-link>
            </div>
        </div>
    </div>
    
</template>

<script>
import { toRef } from '@vue/reactivity';
export default {
    name: "NFT_card",
    props: [
        'Name', 
        "Description", 
        "ImgURL", 
        "Price",
        "TokenId", 
        "Contract_address",
        "Button_words"
    ],
    setup(props) {
        const name = toRef(props, 'Name');
        const description = toRef(props, 'Description');
        const imgURL = toRef(props, 'ImgURL');
        const tokenId = toRef(props, "TokenId")
        const contract_address = toRef(props, "Contract_address")
        const price = toRef(props, 'Price')
        const button_words = toRef(props, 'Button_words')

        const link = "/" + contract_address.value + "/" + tokenId.value
        console.log(contract_address)
        return {
            name,
            description,
            imgURL,
            price,
            tokenId,
            contract_address,
            link,
            button_words
        }
    },
}
</script>

<style scoped>
.card {
    margin: 0.5rem;
    border-radius: 1rem;
    border:#111111 1px solid;
    box-shadow: 2px 10px 10px 3px #cccccc;
}

.imgPart {
    margin: 1rem 0 0 0;
    height: 70%;
}

.card-img-top {
    max-width: 100%;
    max-height: 100%;
    height: 100%;
    width: auto;
}

.card_body {
    height: auto;
}

.NFT_img {
    align-content: center;
    height: 100%;
}
.info {
    display: block;
}

</style>