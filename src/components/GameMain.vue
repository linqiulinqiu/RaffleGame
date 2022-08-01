<template>
  <el-col>
    <el-col id="gamemain">
      <el-col class="pool" :span="18" :offset="3">
        <el-col v-if="stateInfo.uptime.display === false">
          <h1>{{ $t("reading") }}</h1>
        </el-col>
        <el-col v-else-if="stateInfo.uptime.run >= 0">
          <h1>
            {{ $t("running", { times: stateInfo.uptime.display }) }}
          </h1>
          <h3>
            {{ $t("round", { time: stateInfo.stageIndex + 1 }) }}
            <!-- 游戏进行中 <span>第{{ stateInfo.stageIndex + 1 }}轮游戏</span> -->
          </h3>
          <h5>{{ $t("one-million") }}</h5>
          <h1>
            <span>{{ $t("pool") }}：</span>
            <span class="font_color">{{ bonus_pool }}</span> BNB
          </h1>
          <p>
            {{ $t("win-pro") }}: <span>{{ countdown * 100 }}%</span>
          </p>
        </el-col>
        <el-col v-else-if="stateInfo.uptime.run < -100">
          <h1>
            {{ $t("run-pre", { time: stateInfo.uptime.display }) }}
            <!-- 游戏将于{{ stateInfo.uptime.display }}后开始 -->
          </h1>
        </el-col>
        <el-col v-else-if="stateInfo.uptime.run < 0">
          <h1>游戏将于{{ -stateInfo.uptime.display }}后开始</h1>
        </el-col>
        <p>
          {{ $t("total-tik") }}： <span>{{ stateInfo.ticketIndex }}</span>
        </p>
      </el-col>
    </el-col>
    <el-col :span="18" :offset="3">
      <GameMsg
        :bsc="this.bsc"
        :stateInfo="this.stateInfo"
        :win_tips="this.miniWin"
        :loadcliam="this.load_claimble"
      />
    </el-col>
    <el-col v-if="this.owner" :span="18" :offset="3" class="pool addrplay">
      <TeamPool :bsc="this.bsc" />
    </el-col>
    <el-dialog :visible.sync="winnerTip" width="300" class="winner-dialog">
      <el-card>
        <h2 class="center">
          <span v-if="this.bsc.addr == bonusInfo.buyer">
            {{ win_msg[1] }}
          </span>
          <span v-else>{{ win_msg[0] }}</span>
        </h2>
        <p>{{ win_msg[2] }}：{{ bonusInfo.buyer }}</p>
        <p>{{ win_msg[3] }}：{{ bonusInfo.amount }}</p>
        <p>{{ win_msg[4] }}：{{ bonusInfo.stageIdx }}</p>
        <p>{{ win_msg[5] }}：{{ bonusInfo.ticketIdx }}</p>
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
import times from "../times";
export default {
  name: "gameMsg",
  components: {
    GameMsg,
    TeamPool,
  },
  computed: mapState({
    buyerList: "buyerList",
    win_msg: function () {
      return this.$t("win-msg");
    },
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
        myClaimable: 0,
        uptime: {
          display: false,
          run: "",
        },
      },
      bonusInfo: {},
      winnerTip: false,
      owner: false,
      buylist: {},
      miniWin: false,
    };
  },
  mounted: function () {
    this.load_data();
    this.listenEvent();
    this.getOwner();
  },
  methods: {
    load_claimble: async function () {
      const amount = await this.bsc.ctrs.holdgame.claimable();
      this.stateInfo.myClaimable = await tokens.format(
        ethers.constants.AddressZero,
        amount
      );
    },
    load_data: async function () {
      await this.load_claimble();
      const ctr = this.bsc.ctrs.holdgame;
      this.countdown = ethers.utils.formatEther(await ctr.bonusPossible());
      const state = await ctr.bonusState();
      const sinfo = Object.assign({}, this.stateInfo);
      sinfo.ticketPrice = state[0];
      sinfo.stageIndex = state[1].toNumber();
      sinfo.ticketIndex = state[2].toNumber();
      sinfo.h1Balance = state[3];
      sinfo.myTickets = state[4].toNumber();
      // const amount = await ctr.claimable();
      // sinfo.myClaimale = await tokens.format(
      //   ethers.constants.AddressZero,
      //   amount
      // );
      sinfo.uptime.display = times.formatD(Number(state[5]), false);
      sinfo.uptime.run = Number(state[5]);
      this.stateInfo = sinfo;
      // console.log("stateInfo", this.stateInfo);
      this.bonus_pool = await tokens.format(
        ethers.constants.AddressZero,
        this.stateInfo.h1Balance
      );
      this.bonus_pool = Number(this.bonus_pool).toFixed(5);
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
            console.log("win the bonus", this.stateInfo);
            const minirw = ethers.utils.parseUnits("0.05", 18);
            if (e.args.amount.eq(minirw)) {
              if (obj.bsc.addr == e.args[0]) {
                obj.miniWin = true;
                setTimeout(function () {
                  obj.miniWin = false;
                }, 3000);
              }
            } else {
              obj.winnerTip = true;
            }
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
      const blk = e.blockNumber;
      const info = {
        buyer: e.args.buyer,
        idx: parseInt(e.args.from),
        count: parseInt(e.args.count),
      };
      this.buylist[blk] = info;
      const blk_count = Object.keys(this.buylist).length;
      if (blk_count > 5) {
        const start = blk_count - 5;
        this.buylist = Object.fromEntries(
          Object.entries(this.buylist).slice(start, blk_count)
        );
      }
      this.$store.commit("setBuyerList", this.buylist);
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
.winner-dialog {
  background: url("../assets/image/firework.gif");
}
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
