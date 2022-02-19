<template>

  <nav id="nav" class="navbar sticky-top shadow-lg">
    <div class="container-fluid">
      
        <div class="navbar-header">
          <div class="row">
            <div class="Logo col-6">
              <router-link to="/"><img :src="smalllogoimg" alt="Decentral-TH" class="logo"></router-link>
            </div>
            <a class="navbar-brand col-4 align-self-center" href="/">Decentral-TH</a>
          </div>
        </div>
      
      
      <div class="Links">
        <router-link to="/">Home</router-link>  |
        <router-link to="/market">Market</router-link>  |
        <router-link to="/about">About</router-link>  |
        <router-link to="/Help">Help</router-link>  |
        <router-link to="/profile">Profile</router-link>
      </div>
    </div>
  </nav>
  <router-view />
  <vdapp-board />
</template>

<script>
import smalllogoimg from "@/assets/smalllogo.svg"
export default {
  setup() {
    return {
      smalllogoimg,
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  font-size: 1.3rem;
  color: #111111;
}

#nav a.router-link-exact-active {
  color: #8a008a;
}

.navbar {
  background-color: #dac8fd;
}

.Logo {
  width: 20%;
}

.logo {
  height: 5rem;
}

.Links {
  width: 50%;
}
</style>
