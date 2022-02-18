<template>
    <div class="NFT_card">
        <div class="imgPart">
            <img v-bind:src="imgURL" v-bind:alt="name" class="NFT_img">
        </div>
        <hr>
        <div class="info">
            <div class="NFT_name">
                Name {{name}}
            </div>
            <div class="NFT_description">
                {{description}}
            </div>
            
        </div>
        <div class="NFT_price">
            Price: {{price}}
        </div>
        <hr>
        <button v-bind:href="link" class="toBuy">Buy now</button>
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
        "Contract_address"],
    setup(props) {
        const name = toRef(props, 'Name');
        const description = toRef(props, 'Description');
        const imgURL = toRef(props, 'ImgURL');
        const tokenId = toRef(props, "TokenId")
        const contract_address = toRef(props, "Contract_address")
        const price = toRef(props, 'Price')

        const link = "/" + contract_address.value + "/" + tokenId.value
        console.log(contract_address)
        return {
            name,
            description,
            imgURL,
            price,
            tokenId,
            contract_address,
            link
        }
    },
}
</script>

<style scoped>
.NFT_card {
    border-radius: 1rem;
    width: 12rem;
    height: 23rem;
    margin: 1rem;
    box-shadow:0px 0px 1px 1px #cccccc;
}
.imgPart {
    margin: 1rem 0 0 0;
    height: 60%;
}
.NFT_img {
    align-content: center;
    max-width: 100%;
    max-height: 100%;
}
.info {
    display: block;
}
.NFT_name {
    text-justify: auto;
}
.NFT_price {
    width: 100%;
}
.toBuy {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>