<template>
  <el-col>
    <el-col class="tab">
      <el-col class="gs" :lg="{ span: 7, offset: 1 }" :span="18" :offset="1">
        <p>{{ $t("buy") }}</p>
        <el-input
          type="text"
          v-model="tickets_num"
          :placeholder="$t('ipt-num')"
          prefix-icon="el-icon-edit"
          clearable
          class="key-ipt"
        >
          <template slot="append">
            <span class="left">{{ keyPrice }}</span>
            BNB
          </template>
        </el-input>
        <p class="plus-btn">
          <el-button
            icon="el-icon-plus"
            v-for="item in tArr"
            :key="item"
            @click="addKey(item)"
            size="mini"
            >{{ item }}
          </el-button>
        </p>
        <el-button
          :loading="buy_loading"
          type="primary"
          class="buy-btn"
          @click="buyticket"
          >{{ $t("buy") }}</el-button
        >
      </el-col>
      <el-col
        class="gs gs2"
        :lg="{ span: 7 }"
        :span="18"
        :class="{ wintips: this.win_tips }"
      >
        <el-col>
          <p>
            {{ $t("earn") }}:
            <span class="left">{{ stateInfo.myClaimable }}</span> BNB
          </p>
          <p>
            <el-input
              v-model="claim_amount"
              :placeholder="$t('ipt-num')"
              prefix-icon="el-icon-edit"
              clearable
              class="key-ipt"
            >
              <template slot="append">
                <el-button class="left" @click="maxNum">Max</el-button>
              </template>
            </el-input>
            <el-button
              :loading="claim_loading"
              class="ext_btn"
              @click="claim"
              type="primary"
            >
              {{ $t("claim") }}
            </el-button>
          </p>
          <p>{{ $t("my-ticket") }} : {{ stateInfo.myTickets }}</p>
        </el-col>
      </el-col>
      <el-col class="gs" :lg="{ span: 7 }" :span="18">
        <h4>{{ $t("msg-bar") }}</h4>
        <MsgCarousel />
      </el-col>
    </el-col>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import game from "../../game";
import tokens from "../../tokens";
import MsgCarousel from "./MsgCarousel.vue";
export default {
  name: "gameMsg",
  props: ["bsc", "stateInfo", "win_tips", "loadcliam"],
  components: {
    MsgCarousel,
  },
  computed: {
    keyPrice: function () {
      if (this.tickets_num != "") {
        const price = this.stateInfo.ticketPrice;
        const allPrice = ethers.utils.formatUnits(
          price.mul(this.tickets_num),
          18
        );
        return allPrice;
      }
      return "";
    },
  },
  data() {
    return {
      tickets_num: "",
      tArr: [1, 3, 10, 100],
      buy_loading: false,
      extract_amount: "",
      claim_amount: "",
      claim_loading: false,
      addrZero: ethers.constants.AddressZero,
    };
  },
  mounted: function () {},
  methods: {
    addKey: function (number) {
      this.tickets_num = number.toString();
    },
    buyticket: async function () {
      this.buy_loading = true;
      const ctr = this.bsc.ctrs.holdgame;
      const buy_count = ethers.BigNumber.from(this.tickets_num);
      const obj = this;
      const gas = ethers.BigNumber.from(80 * 10000).add(
        buy_count.mul(10 * 10000)
      );
      try {
        const res = await ctr.buy(buy_count, {
          value: this.stateInfo.ticketPrice.mul(buy_count),
          gasLimit: gas,
        });
        await game.waitEventDone(res, function (e) {
          obj.buy_loading = false;
          obj.tickets_num = "";
          // obj.load_ext_amount();
        });
      } catch (e) {
        this.buy_loading = false;
        console.log("buy ticket", e);
      }
    },
    maxNum: function () {
      this.claim_amount = this.stateInfo.myClaimable;
    },
    claim: async function () {
      this.claim_loading = true;
      const ctr = this.bsc.ctrs.holdgame;
      const amount = await tokens.parse(this.addrZero, this.claim_amount);
      if (this.claim_amount > this.stateInfo.myClaimable) {
        this.claim_loading = false;
        return this.$message("请输入正确的金额");
      } else {
        try {
          const obj = this;
          const res = await ctr.claim(amount);
          await game.waitEventDone(res, function (e) {
            obj.claim_loading = false;
            obj.claim_amount = "";
            obj.loadcliam();
          });
        } catch (e) {
          console.log("claim err", e);
          this.claim_loading = false;
        }
      }
    },
  },
};
</script>
<style>
.wintips::before {
  content: "Win 0.05 BNB";
  border-radius: 20px;
  padding-top: 20px;
  font-size: 30px;
  text-align: center;
  color: #38f2af;
  background: url("../../assets/image/win.gif") no-repeat;
  width: 200px;
  height: 160px;
  display: inline-block;
  position: absolute;
  top: -140px;
  right: 20px;
}
.tab {
  background: rgba(55, 57, 67, 1);
  margin-top: 20px;
  padding: 30px;
  border-radius: 20px;
}
.tab .gs > p {
  margin: 10px 0;
}
.gs {
  padding: 25px;
  border-radius: 20px;
  background: rgb(64, 67, 77);
  margin-right: 25px;
  min-height: 250px;
}
.gs2 {
  position: relative;
}
.left {
  margin-left: 10px;
}
.gs .key-ipt.el-input {
  width: 60%;
  min-width: 200px;
}
.gs .ext_btn {
  margin-left: 10px;
}
.gs .ext_btn:hover {
  color: #38f2af;
}
.buy-btn.el-button {
  width: 150px;
  font-size: 20px;
}
.buy-btn.el-button:hover {
  color: #38f2af;
}
</style>
