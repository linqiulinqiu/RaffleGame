<template>
  <el-col>
    <el-carousel height="100px" direction="vertical" :interval="2000">
      <el-carousel-item v-for="info in buyerList" :key="info.index">
        <span>
          购买者地址：{{
            info.buyer.substr(0, 6) + "..." + info.buyer.substr(-4, 4)
          }}
        </span>
        <br />
        <span>持有的最后一张票证号：{{ info.index }}</span>
      </el-carousel-item>
    </el-carousel>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  // props: ["buyerList"],
  computed: mapState({
    buyerList: "buyerList",
  }),
};
</script>