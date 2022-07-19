<template>
  <el-col>
    <GameMain v-if="bsc.addr" :bsc="bsc" />
    <el-col v-else
      ><h2>{{ $t("look-info") }}</h2></el-col
    >
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import GameMain from "../components/GameMain.vue";
export default {
  name: "game",
  computed: mapState({
    bsc: "bsc",
  }),
  components: {
    GameMain,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style>
</style>