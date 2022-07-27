<template>
  <el-col>
    <el-carousel
      height="150px"
      :interval="2000"
      :loop="false"
      arrow="never"
      indicator-position="none"
    >
      <el-carousel-item v-for="info in buyerList" :key="info.idx">
        <span>
          {{ $t("buyer") }}：{{
            info.buyer.substr(0, 6) + "..." + info.buyer.substr(-4, 4)
          }}
        </span>
        <br />
        <span> {{ $t("buy-num") }}：{{ info.count }}</span>
        <br />
        <span>
          {{ $t("buy-tk") }}：
          <span v-if="info.count == 1">#{{ info.idx + info.count }}</span>
          <span v-else>#{{ info.idx }} ~ #{{ info.idx + info.count }}</span>
        </span>
      </el-carousel-item>
    </el-carousel>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: mapState({
    buyerList: "buyerList",
  }),
};
</script>