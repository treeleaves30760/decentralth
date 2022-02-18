<template>
  <div class="container">
    <div class="home">
      <img :src="smalllogoimg" alt="Decentral-TH" class="logo">
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import smalllogoimg from "@/assets/smalllogo.svg"
export default {
  name: 'Home',
  components: {
  },
  setup() {
    return {
      smalllogoimg,
    }
  }
}
</script>

<style scoped>
.home {
  margin: auto;
  width: 60%;
}
</style>