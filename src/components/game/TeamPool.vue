<template>
  <el-col>
    <h4>{{ $t("team-pool") }}</h4>
    <p>
      <span v-for="(key, value) in this.team_pool_list" :key="value">
        {{ key.amount }} {{ value }}
        <el-button @click="teamClaim(key['addr'])">{{ $t("claim") }}</el-button>
        <br />
      </span>
    </p>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
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
        await ctr.teamClaimable(this.addrZero)
      );
      const pbpaddr = this.bsc.ctrs.pbp.address;
      this.team_pool_list["PBP"].addr = pbpaddr;
      this.team_pool_list["PBP"].amount = await tokens.format(
        pbpaddr,
        await ctr.teamClaimable(pbpaddr)
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