<template>
  <el-col>
    <h4>团队资金</h4>
    <p>
      <span v-for="(key, value) in this.team_pool_list" :key="value">
        {{ key.amount }} {{ value }}
        <el-button @click="teamClaim(key['addr'])">提取</el-button>
        <br />
      </span>
    </p>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import game from "../../game";
import tokens from "../../tokens";
export default {
  props: ["bsc"],
  data() {
    return {
      addrZero: ethers.constants.AddressZero,
      team_pool_list: {
        BNB: { addr: "", amount: "" },
        PBP: { addr: "", amount: "" },
      },
      team_loading: false,
    };
  },
  mounted() {
    this.load_teamPool();
  },
  methods: {
    load_teamPool: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      this.team_pool_list["BNB"].addr = this.addrZero;
      this.team_pool_list["BNB"].amount = await tokens.format(
        this.addrZero,
        await tokens.balance(this.addrZero, ctr.addr)
      );
      const pbpaddr = this.bsc.ctrs.pbp.address;
      this.team_pool_list["PBP"].addr = pbpaddr;
      this.team_pool_list["PBP"].amount = await tokens.format(
        pbpaddr,
        await tokens.balance(pbpaddr, ctr.address)
      );
      console.log("team pool", this.team_pool_list);
    },
    teamClaim: async function (addr) {
      const res = await this.bsc.ctrs.holdgame.teamClaim(addr);
      console.log("team pool", res);
    },
  },
};
</script>