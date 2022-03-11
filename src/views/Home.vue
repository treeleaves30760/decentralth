<template>
  <div class="container-fluid mt-2">
    <div class="bg-image container-fluid" style="opacity: 40%;"></div>
    <div class="home">
      <div class="introductionPart">
        <div class="row">
          <div class="flex introWords col-xs-12 col-lg-6 align-self-center">
            <b><h1>Welcome to Decentral-TH Exchange</h1></b>
            <router-link to="/explore"><button class="btn btn-outline-primary btn-lg">Explore</button></router-link>
          </div>
          <div class="flex introPic col-xs-12 col-lg-6">
            <img :src="logo" alt="Decentral-TH">
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
// @ is an alias to /src
import smalllogoimg from "@/assets/smalllogo.svg"
import logo from "@/assets/logo.svg"
export default {
  name: 'Home',
  components: {
  },
  setup() {
    return {
      smalllogoimg,
      logo
    }
  }
}
</script>

<style scoped>
.home {
  margin: auto;
  height: 1000rem;
}

.bg-image {
  background-image: url("../assets/logo.svg");

  /* Add the blur effect */
  filter: blur(8px);
  -webkit-filter: blur(8px);
  opacity: 0.4;
  z-index: -10;

  /* Full height */
  height: 100%;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  background-position-x: 0;
  background-position-y: -20rem;
}

</style>