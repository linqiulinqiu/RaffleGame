<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <h2>最终大奖</h2>
        <h5>谁能万里挑一？</h5>
        <h1>
          <span class="font_color">{{ bonus_pool }}</span> BNB
        </h1>
        <p>
          结束概率: <span>{{ countdown * 100 }}%</span>
        </p>
        <p>
          总票证数： <span>{{ total_tickets }}</span>
        </p>
      </el-col>
    </el-col>
    <el-col>
      <GameMsg :bsc="this.bsc" :mytickets="this.mytickets" />
    </el-col>
  </el-col>
</template>
<script>
import GameMsg from "./game/GameMsg.vue";
import { ethers } from "ethers";
import tokens from "../tokens";
export default {
  name: "gameMsg",
  components: {
    GameMsg,
  },
  props: ["bsc"],
  data() {
    return {
      bonus_pool: "未开始",
      countdown: "未开始",
      total_tickets: "未开始",
      mytickets: "",
    };
  },
  mounted: function () {
    this.load_data();
  },
  methods: {
    load_data: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      this.countdown = ethers.utils.formatEther(await ctr.bonusPossible());
      const stateInfo = await ctr.bonusState();
      console.log("load all data", this.countdown, stateInfo[3]);
      this.bonus_pool = await tokens.format(
        ethers.constants.AddressZero,
        stateInfo[2]
      );
      this.mytikets = Number(stateInfo[3]);
      console.log("this.My", this.mytickets);
      this.total_tickets = parseInt(stateInfo[1]);
    },
  },
};
</script>
<style>
.pool {
  /* text-align: center; */
  border: 1px solid #fff;
  border-radius: 20px;
  padding: 40px;
  background: rgba(55, 57, 67, 1);
}
#gamemain {
  text-align: center;
  padding-top: 75px;
}
.font_color {
  color: #38f2af;
}
</style>