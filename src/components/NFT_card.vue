<template>
    <div>
        <div class="card d-flex " :class="cardShadow">
            <div class="imgPart ratio ratio-1x1">
                <div class="container"> 
                    <img v-bind:src="imgURL" v-bind:alt="name" class="card-img-top">
                </div>
            </div>
            <hr>
            <div class="card-body">
                <div class="info">
                    <h5 class="card-title">
                        {{name}}
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
import { reactive, toRef } from '@vue/reactivity';
export default {
    name: "NFT_card",
    props: [
        'Name', 
        "Description", 
        "ImgURL", 
        "Price",
        "TokenId", 
        "Contract_address",
        "Button_words",
        "Level",
    ],
    setup(props) {
        const name = toRef(props, 'Name');
        const description = toRef(props, 'Description');
        const imgURL = toRef(props, 'ImgURL');
        const tokenId = toRef(props, "TokenId")
        const contract_address = toRef(props, "Contract_address")
        const price = toRef(props, 'Price')
        const button_words = toRef(props, 'Button_words')
        const level = toRef(props, "Level")

        const link = "/" + contract_address.value + "/" + tokenId.value

        const cardShadow = reactive({
            defaultLevel: level.value == -1 || !(level.value),
            GLevel: level.value == 0,
            FLevel: level.value == 1,
            ELevel: level.value == 2,
            DLevel: level.value == 3,
            CLevel: level.value == 4,
            BLevel: level.value == 5,
            ALevel: level.value == 6,
            SLevel: level.value == 7,
        })
        // console.log(contract_address)
        return {
            name,
            description,
            imgURL,
            price,
            tokenId,
            contract_address,
            link,
            button_words,
            level,
            cardShadow
        }
    },
}
</script>

<style scoped>
:root {
    --size-of-shadow: 1.25rem
}

.card {
    margin: 0.5rem;
    border-radius: 1rem;
    border:#111111 1px solid;
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

.defaultLevel {
    box-shadow: 0 0 1.5rem #cccccc;
}

.GLevel {
    box-shadow: 0 0 1.5rem #333333;
}

.FLevel {
    box-shadow: 0 0 1.5rem #360683;
}

.ELevel {
    box-shadow: 0 0 1.5rem #0e6aa7;
}

.DLevel {
    box-shadow: 0 0 1.5rem #087704;
}

.CLevel {
    box-shadow: 0 0 1.5rem #0fda2a;
}

.BLevel {
    box-shadow: 0 0 1.5rem #e95e0e;
}

.ALevel {
    box-shadow: 0 0 1.5rem #ef8b08;
}

.SLevel {
    box-shadow: 0 0 1.5rem #fffb04;
}

</style>