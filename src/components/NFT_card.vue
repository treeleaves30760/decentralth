<template>
    <div>
        <div class="card d-flex " :class="cardShadow">
            <div :class="cardWords" class="fst-italic">{{levelWord}}</div>
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
import { reactive, ref, toRef } from '@vue/reactivity';
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
        const levelWord = ref("")

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
            SSLevel: level.value == 8,
        })

        const cardWords = reactive({
            defaultLevelWord: level.value == -1 || !(level.value),
            GLevelWord: level.value == 0,
            FLevelWord: level.value == 1,
            ELevelWord: level.value == 2,
            DLevelWord: level.value == 3,
            CLevelWord: level.value == 4,
            BLevelWord: level.value == 5,
            ALevelWord: level.value == 6,
            SLevelWord: level.value == 7,
            SSLevelWord: level.value == 8,
        })

        switch (level.value) {
            case 0:
                levelWord.value = "G";
                break;
            case 1:
                levelWord.value = "F";
                break;
            case 2:
                levelWord.value = "E";
                break;
            case 3:
                levelWord.value = "D";
                break;
            case 4:
                levelWord.value = "C";
                break;
            case 5:
                levelWord.value = "B";
                break;
            case 6:
                levelWord.value = "A";
                break;
            case 7:
                levelWord.value = "S";
                break;
            case 8:
                levelWord.value = "SS";
                break;
        }
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
            cardShadow,
            cardWords,
            levelWord
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

.defaultLevelWord {
    color: #000000;
    position: absolute;
}

.GLevel {
    box-shadow: 0 0 1.5rem #333333;
}

.GLevelWord {
    color: #333333;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.FLevel {
    box-shadow: 0 0 1.5rem #360683;
}

.FLevelWord {
    color: #360683;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.ELevel {
    box-shadow: 0 0 1.5rem #0e6aa7;
}

.ELevelWord {
    color: #0e6aa7;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.DLevel {
    box-shadow: 0 0 1.5rem #0b6e51;
}

.DLevelWord {
    color: #0b6e51;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.CLevel {
    box-shadow: 0 0 1.5rem #057914;
}

.CLevelWord {
    color: #057914;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.BLevel {
    box-shadow: 0 0 1.5rem #e95e0e;
}

.BLevelWord {
    color: #e95e0e;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.ALevel {
    box-shadow: 0 0 1.5rem #ef8b08;
}

.ALevelWord {
    color: #ef8b08;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

.SLevel {
    box-shadow: 0 0 1.5rem #fffb04;
}

.SLevelWord {
    color: #ffd104;
    font-size: 2rem;
    font-weight: bold;
    position: absolute;
    left: -1rem;
    top: -1rem;
    z-index: 100;
    background: #ffffff;
    width: 3.2rem;
    height: 3.2rem;
    align-content: center;
    border-radius: 500rem;
    border: #000 2px solid;
}

</style>