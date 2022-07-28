<template>
  <el-col id="home" :span="24">
    <h1>A little game</h1>
    <el-col>
      <Connect />
    </el-col>
  </el-col>
</template>
<script>
import Connect from "../components/lib/ConnectUs.vue";
export default {
  name: "Home",
  components: {
    Connect,
  },
};
</script>
<style>
#home {
  text-align: center;
  margin: 0px auto;
}
</style>