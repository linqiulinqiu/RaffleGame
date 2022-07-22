<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <el-col v-if="this.stateInfo[5]">
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
      <GameMsg :bsc="this.bsc" :stateInfo="this.stateInfo" />
    </el-col>
    <el-col v-if="this.owner" :span="18" :offset="3" class="pool addrplay">
      <TeamPool :bsc="this.bsc" />
    </el-col>
    <el-dialog
      :visible.sync="winnerTip"
      title="The winner tips"
      width="300"
      class="winer-dialog"
    >
      <el-card>
        <h3 class="center">本轮奖励已产生</h3>
        <p>中奖者：{{ bonusInfo.addr }}</p>
        <p>金额：{{ bonusInfo.amount }}</p>
        <p>奖励轮数：{{ bonusInfo.bonusIdx }}</p>
        <p>奖券编号：{{ bonusInfo.ticketIdx }}</p>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import GameMsg from "./game/GameMsg.vue";
import TeamPool from "./game/TeamPool.vue";
import { ethers } from "ethers";
import tokens from "../tokens";
import { mapState } from "vuex";
export default {
  name: "gameMsg",
  components: {
    GameMsg,
    TeamPool,
  },
  computed: mapState({
    buyerList: "buyerList",
  }),
  props: ["bsc"],
  data() {
    return {
      bonus_pool: "0",
      countdown: "null",
      times: "",
      stateInfo: ["", "", "", "", "", true],
      winnerTip: false,
      bonusInfo: {},
      owner: false,
    };
  },
  mounted: function () {
    this.load_data();
    this.listenEvent();
    this.getOwner();
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
    listenEvent: async function () {
      const obj = this;
      const ctr = this.bsc.ctrs.holdgame;
      if (ctr.filters.BonusHit) {
        ctr.on(ctr.filters.BonusHit, async function (e) {
          if (e.event == "BonusHit") {
            console.log("bonusHit", e);
            obj.load_data();
            obj.bonusHit(e);
            obj.winnerTip = true;
          }
        });
      }
      if (ctr.filters.TicketBought) {
        ctr.on(ctr.filters.TicketBought, async function (e) {
          if (e.event == "TicketBought") {
            console.log("TicketBought", e);
            obj.load_data();
            obj.ticket_bought(e);
          }
        });
      }
    },
    bonusHit: async function (e) {
      const amount = await tokens.format(
        ethers.constants.AddressZero,
        e.args.amount
      );
      this.bonusInfo = {
        addr: e.args[0],
        amount: amount,
        bonusIdx: e.args.bonusIdx,
        ticketIdx: e.args.ticketIdx,
      };
    },
    ticket_bought: function (e) {
      const buyer = e.args.buyer;
      const index = parseInt(e.args.idx);
      const key = buyer;
      const info = {
        buyer: buyer,
        index: index,
      };
      this.buyerList[key] = info;
      console.log("buyerList all", this.buyerList);
      const buy_num = Object.keys(this.buyerList).length;
      if (buy_num > 5) {
        const start = buy_num - 5;
        this.buyerList = Object.fromEntries(
          Object.entries(this.buyerList).slice(start, buy_num)
        );
      }
      console.log("buyerList slice", this.buyerList);

      this.$store.commit("setBuyerList", this.buyerList);
    },
    getOwner: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      const ownerAddr = await ctr.owner();
      if (this.bsc.addr == ownerAddr) this.owner = true;
      console.log("owner", ownerAddr);
    },
  },
};
</script>
<style>
.winner-dialog .el-card {
  padding: 30px;
}
.center {
  text-align: center;
}
.winner {
  background: olive;
  min-height: 200px;
}
.addrplay {
  margin: 20px 0;
}
.pool {
  border-radius: 20px;
  padding: 40px;
  background: rgba(55, 57, 67, 1);
}
#gamemain {
  text-align: center;
  padding-top: 50px;
}
.font_color {
  color: #38f2af;
}
</style>