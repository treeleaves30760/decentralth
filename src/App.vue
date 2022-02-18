<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/market">Market</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/Help">Help</router-link> |
    <router-link to="/profile">Profile</router-link>
  </div>
  <router-view/>
</template>

<script>
export default {
  setup() {
    return {
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

#nav {
  padding: 1rem;
}

#nav a {
  font-weight: bold;
  color: #000000;
}

#nav a.router-link-exact-active {
  color: #8a008a;
}

#logo {
  width: 3rem;
}
</style>
