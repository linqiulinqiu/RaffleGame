<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <el-col v-if="this.stateInfo[4]">
          <h3>
            游戏进行中 <span>第{{ times + 1 }}轮游戏</span>
          </h3>
          <h5>谁能万里挑一？</h5>
          <h1>
            <span>奖池：</span>
            <span class="font_color">{{ bonus_pool }}</span> BNB
          </h1>
          <p>
            中奖概率: <span>{{ countdown * 100 }}%</span>
          </p>
        </el-col>
        <el-col v-else>
          <h1>游戏已结束，大奖已产生</h1>
        </el-col>
        <p>
          总票证数： <span>{{ parseInt(stateInfo[1]) }}</span>
        </p>
        <p>
          <el-popover
            placement="right"
            title="Winner List"
            width="400"
            trigger="click"
          >
            <ul>
              <li v-for="(item, index) in stateInfo[0]" :key="index">
                {{ item }}
              </li>
            </ul>
            <el-button slot="reference" size="mini">中奖者名单</el-button>
          </el-popover>
        </p>
      </el-col>
    </el-col>
    <el-col :span="18" :offset="3">
      <GameMsg
        :bsc="this.bsc"
        :stateInfo="this.stateInfo"
        :load_data="load_data"
      />
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
      bonus_pool: "0",
      countdown: "null",
      times: "",
      stateInfo: "",
    };
  },
  mounted: function () {
    this.load_data();
    setInterval(() => {
      this.load_data();
    }, 1000 * 60);
  },
  methods: {
    load_data: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      this.countdown = ethers.utils.formatEther(await ctr.bonusPossible());
      this.stateInfo = await ctr.bonusState();
      console.log("load all data", this.stateInfo);
      this.bonus_pool = await tokens.format(
        ethers.constants.AddressZero,
        this.stateInfo[2]
      );
      this.times = this.stateInfo[0].length;
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