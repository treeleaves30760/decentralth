import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Profile from "../views/Profile.vue"
import SingleNFT from "../views/SingleNFT.vue"
import NotFound from '../views/NotFound.vue'
import Lottery from '../views/Lottery'
import Help from "../views/Help.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/help',
    name: 'Help',
    component: Help
  },
  {
    path: '/lottery',
    name: 'Lottery',
    component: Lottery
  },
  {
    path: '/:contract_address/:tokenId',
    name: 'TokenId',
    component: SingleNFT
  },
  { path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
