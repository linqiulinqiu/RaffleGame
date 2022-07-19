<template>
  <el-col>
    <el-col class="tab">
      <el-col
        class="gs"
        :lg="{ span: 9, offset: 3 }"
        :md="{ sapn: 18, offset: 3 }"
        :sm="{ span: 18, offset: 3 }"
        :xs="{ span: 18, offset: 3 }"
      >
        <p>购买</p>
        <el-input
          type="text"
          v-model="buyKey"
          placeholder="输入数字"
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
          <el-button icon="el-icon-plus" @click="addKey(1)">1</el-button>
          <el-button icon="el-icon-plus" @click="addKey(3)">3</el-button>
          <el-button icon="el-icon-plus" @click="addKey(10)">10</el-button>
          <el-button icon="el-icon-plus" @click="addKey(100)">100</el-button>
        </p>
        <el-button
          :loading="buy_loading"
          type="primary"
          class="buy-btn"
          @click="buyticket"
          >Buy</el-button
        >
      </el-col>
      <el-col
        class="gs gs2"
        :lg="{ span: 9, offset: 0 }"
        :md="{ sapn: 18, offset: 3 }"
        :sm="{ span: 18, offset: 3 }"
        :xs="{ span: 18, offset: 3 }"
      >
        <p>
          奖金: <span class="left">{{ extract_amount }}</span> BNB
          <el-button :loading="extract_loading" class="ext_btn">
            提取
          </el-button>
        </p>
        <p>我的票证数 : {{ ticket_amount }}</p>
        <p>票证号：</p>
      </el-col>
    </el-col>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import game from "../../game";
import tokens from "../../tokens";
export default {
  name: "gameMsg",
  props: ["bsc", "mytickets"],
  computed: {
    keyPrice: function () {
      if (this.buyKey != "") {
        const pn = 0.01;
        const money = pn * this.buyKey;
        return money;
      }
      return "";
    },
  },
  data() {
    return {
      buyKey: "",
      buy_loading: false,
      extract_amount: "null",
      extract_loading: false,
      ticket_amount: "null",
    };
  },
  mounted: function () {
    this.load_ext_amount();
  },
  methods: {
    addKey: function (number) {
      this.buyKey = number.toString();
    },
    buyticket: async function () {
      this.buy_loading = true;
      const ctr = this.bsc.ctrs.holdgame;
      const big_num = ethers.BigNumber.from(this.buyKey);
      const cfg = await ctr.configInfo();
      const price = cfg[1];
      console.log("config Info", cfg[0], ethers.utils.formatEther(cfg[1]));
      const obj = this;
      try {
        const res = await ctr.buy(big_num, {
          value: price.mul(big_num),
        });
        await game.waitEventDone(res, function (e) {
          obj.buy_loading = false;
        });
      } catch (e) {
        this.buy_loading = false;
        console.log("buy ticket", e);
      }
    },
    //获取收益信息
    load_ext_amount: async function () {
      console.log("bsc", this.bsc);
      const ctr = this.bsc.ctrs.holdgame;
      const amount = await ctr.claimable();
      console.log("amount", amount);
      this.extract_amount = await tokens.format(
        ethers.constants.AddressZero,
        amount
      );
      this.ticket_amount = this.mytickets;
      console.log(
        "load data",
        this.extract_amount,
        this.ticket_amount,
        this.mytickets
      );
    },
  },
};
</script>
<style>
.tab .gs > p {
  margin: 10px 0;
}
.gs {
  /* border: 1px solid #fff; */
  padding: 40px;
  margin-top: 40px;
  border-radius: 20px;
  background: rgba(55, 57, 67, 1);
  margin-right: 20px;
  min-height: 300px;
}
.left {
  margin-left: 10px;
}
.key-ipt.el-input {
  width: 400px;
}
/* .plus-btn .el-button { 
     margin-right: 5px;
}*/

/* .gs.gs2 {
  margin-left: 2%;
} */
.gs .ext_btn {
  margin-left: 10px;
}
.buy-btn.el-button {
  width: 150px;
  font-size: 20px;
}
.buy-btn.el-button:hover {
  color: #38f2af;
}
</style>