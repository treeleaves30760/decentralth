<template>
  <nav id="nav" class="navbar sticky-top shadow-lg">
    <div class="container">
      <div class="navbar-header">
        <div class="row">
          <div class="Logo col-6">
            <router-link to="/"><img :src="smalllogoimg" alt="Decentral-TH" class="logo"></router-link>
          </div>
          <a class="navbar-brand col-4 align-self-center" href="/">Decentral-TH</a>
        </div>
      </div>
      
      <div class="Links row">
        <router-link to="/" class="col">Home</router-link>
        <router-link to="/explore" class="col">Explore</router-link>
        <router-link to="/lottery" class="col">Lottery</router-link>
        <router-link to="/fusion" class="col">Fusion</router-link>
        <router-link to="/about" class="col">About</router-link>
        <router-link to="/Help" class="col">Help</router-link>
        <router-link to="/profile" class="col">Profile</router-link>
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
  text-decoration-line: unset;
}

#nav a.router-link-exact-active {
  color: #8a008a;
}

.navbar {
  background: #dac8fd;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #e0d0fd, #af94fb,#c0c0fd, #e0d0fd);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #e0d0fd, #af94fb,#c0c0fd, #e0d0fd); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  z-index: 1000;
}

.Logo {
  width: 20%;
}

.logo {
  height: 5rem;
}
</style>
