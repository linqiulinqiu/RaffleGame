<template>
  <el-col id="home" :span="24">
    <h1>A little game</h1>
    <h2>
      If you have some questions, welcome to contract us with links in the
      following.
      <br />
      We will be very honored to receive your feedback.
    </h2>
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
  padding-top: 100px;
  text-align: center;
  margin: 0px auto;
}
</style>