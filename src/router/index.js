import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from "@/views/Game"
import Doc from "@/views/Doc"

Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: "/Game",
    component: Game,
  },
  {
    path: "/Game",
    name: "Game",
    component:Game
  },
  {
    path: "/Doc",
    name: "Doc",
    component:Doc
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router