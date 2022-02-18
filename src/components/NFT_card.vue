<template>
    <div class="NFT_card">
        <img v-bind:src="imgURL" v-bind:alt="name" class="NFT_img">
        <div class="info">
            <div>
                Name {{name}}
            </div>
            {{description}}
        </div>
        <a v-bind:href="link">
            <button class="toBuy">Buy now</button>
        </a>
    </div>
</template>

<script>
import { toRef } from '@vue/reactivity';
export default {
    name: "NFT_card",
    props: ['Name', "Description", "ImgURL", "TokenId", "Contract_address"],
    setup(props) {
        const name = toRef(props, 'Name');
        const description = toRef(props, 'Description');
        const imgURL = toRef(props, 'ImgURL');
        const tokenId = toRef(props, "TokenId")
        const contract_address = toRef(props, "Contract_address")

        const link = "/" + contract_address.value + "/" + tokenId.value
        console.log(contract_address)
        return {
            name,
            description,
            imgURL,
            tokenId,
            contract_address,
            link
        }
    },
}
</script>

<style scoped>
.NFT_card {
    width: 12rem;
    height: 19.416rem;
    margin: 1rem;
    box-shadow:2px 2px 1px 1px #cccccc;
}
.NFT_img {
    width: 100%;
}
</style>