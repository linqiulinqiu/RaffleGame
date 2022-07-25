<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <el-col v-if="stateInfo.uptime === false">
          <h1>读取中，请稍等...</h1>
        </el-col>
        <el-col v-else-if="stateInfo.uptime >= 0">
          <h1>
            已运行 <span>{{ stateInfo.uptime }}秒</span>
          </h1>
          <h3>
            游戏进行中 <span>第{{ stateInfo.stageIndex + 1 }}轮游戏</span>
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
        <el-col v-else-if="stateInfo.uptime < -100">
          <h1>游戏将于{{ -(stateInfo.uptime / 60) }}分钟后开始</h1>
        </el-col>
        <el-col v-else-if="stateInfo.uptime < 0">
          <h1>游戏将于{{ -stateInfo.uptime }}秒后开始</h1>
        </el-col>
        <p>
          总票证数： <span>{{ stateInfo.ticketIndex }}</span>
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
        <p>中奖者：{{ bonusInfo.buyer }}</p>
        <p>金额：{{ bonusInfo.amount }}</p>
        <p>奖励轮数：{{ bonusInfo.stageIdx }}</p>
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
      stateInfo: {
        ticketPrice: ethers.BigNumber.from(0),
        stageIndex: 0,
        ticketIndex: 0,
        h1Balance: ethers.BigNumber.from(0),
        myTickets: 0,
        uptime: false,
      },
      bonusInfo: {},
      winnerTip: false,
      owner: false,
      buylist: {},
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
      const state = await ctr.bonusState();
      const sinfo = Object.assign({}, this.stateInfo);
      sinfo.ticketPrice = state[0];
      sinfo.stageIndex = state[1].toNumber();
      sinfo.ticketIndex = state[2].toNumber();
      sinfo.h1Balance = state[3];
      sinfo.myTickets = state[4].toNumber();
      sinfo.uptime = Number(state[5]);
      this.stateInfo = sinfo;

      // console.log("load all data", this.stateInfo);
      this.bonus_pool = await tokens.format(
        ethers.constants.AddressZero,
        this.stateInfo.h1Balance
      );
    },
    listenEvent: async function () {
      const obj = this;
      const ctr = this.bsc.ctrs.holdgame;
      if (ctr.filters.WinBonus) {
        ctr.on(ctr.filters.WinBonus, async function (e) {
          if (e.event == "WinBonus") {
            console.log("win-bonus", e);
            obj.load_data();
            obj.bonusHit(e);
          }
        });
      }
      if (ctr.filters.TicketsBought) {
        ctr.on(ctr.filters.TicketsBought, async function (e) {
          if (e.event == "TicketsBought") {
            console.log("tickets-bought", e);
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
        buyer: e.args[0],
        amount: amount,
        stageIdx: e.args.stageIdx,
        ticketIdx: e.args.ticketIdx,
      };
    },
    ticket_bought: function (e) {
      let list = this.buylist;
      const buyer = e.args.buyer;
      const index = parseInt(e.args[1]);
      const amount = parseInt(e.args[2]);
      const key = buyer;
      const info = {
        buyer: buyer,
        index: index,
        count: amount,
      };
      console.log("info", info, info.count, key);
      list[key] = info;
      const buy_num = Object.keys(list).length;
      console.log("buyerList", list, buy_num);

      if (buy_num > 5) {
        const start = buy_num - 5;
        list = Object.fromEntries(Object.entries(list).slice(start, buy_num));
      }
      console.log("buyerList slice", list);

      this.$store.commit("setBuyerList", list);
      console.log(this.$store.state.buyerList);
    },
    getOwner: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      const ownerAddr = await ctr.owner();
      if (this.bsc.addr == ownerAddr) this.owner = true;
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
