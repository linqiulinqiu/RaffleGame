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
        </p>
        <p>
          <el-input
            v-model="claim_amount"
            placeholder="输入数字"
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
            提取
          </el-button>
        </p>
        <p>我的票证数 : {{ mytickets }}</p>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="winTip" title="The Win Tip" width="400px">
      <h1>中奖了！！！</h1>
    </el-dialog>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import game from "../../game";
import tokens from "../../tokens";
export default {
  name: "gameMsg",
  props: ["bsc", "mytickets", "load_data"],
  computed: {
    keyPrice: function () {
      if (this.buyKey != "") {
        return this.tPrice * this.buyKey;
      }
      return "";
    },
  },
  data() {
    return {
      buyKey: "",
      buy_loading: false,
      extract_amount: "",
      claim_amount: "",
      claim_loading: false,
      winTip: false,
      cfg: [],
      tPrice: "",
      addrZero: ethers.constants.AddressZero,
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
      const obj = this;
      const gas = ethers.BigNumber.from(80 * 10000).add(
        big_num.mul(10 * 10000)
      );
      try {
        const res = await ctr.buy(big_num, {
          value: this.cfg[1].mul(big_num),
          gasLimit: gas,
        });
        await game.waitEventDone(res, function (e) {
          console.log("waitdown buy res", res, e);
          obj.buy_loading = false;
          obj.buyKey = "";
          obj.load_data();
          obj.load_ext_amount();
        });
      } catch (e) {
        this.buy_loading = false;
        console.log("buy ticket", e);
      }
    },
    load_ext_amount: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      const amount = await ctr.claimable();
      this.extract_amount = await tokens.format(this.addrZero, amount);
      this.cfg = await ctr.configInfo();
      this.tPrice = await tokens.format(this.addrZero, this.cfg[1]);
    },
    maxNum: function () {
      this.claim_amount = this.extract_amount;
    },
    claim: async function () {
      this.claim_loading = true;
      const ctr = this.bsc.ctrs.holdgame;
      const amount = await tokens.parse(this.addrZero, this.claim_amount);
      if (this.claim_amount > this.extract_amount) {
        return this.$message("请输入正确的金额");
      } else {
        try {
          const obj = this;
          const res = await ctr.claim(amount);
          await game.waitEventDone(res, function (e) {
            obj.claim_loading = false;
            obj.claim_amount = "";
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