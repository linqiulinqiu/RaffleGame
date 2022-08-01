import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from "@/views/Game"
import Doc from "@/views/Doc"
import Home  from "@/views/Home"
import WhitePaper from "@/components/doc/WhitePaper"
import Instruction from "@/components/doc/Instruction"

Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: "/Home",
    component: Game,
  },
  {
    path: "/Home",
    name: "Home",
    component:Home
  },
  {
    path: "/Game",
    name: "Game",
    component:Game
  },
  {
    path: "/Doc",
    name: "Doc",
    component: Doc,
    redirect:"/Doc/WhitePaper",
    children: [
      {
        path: "/Doc/WhitePaper",
        name:'WhitePaper',
        component:WhitePaper
      }, {
        path:"/Doc/Instruction",
        name: "Instruction",
        component:Instruction
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router