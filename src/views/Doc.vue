<template>
  <el-container id="doc">
    <el-aside width="250">
      <el-menu
        :router="true"
        :default-active="this.menuIndex"
        text-color="#fff"
        background-color="#25272e"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in this.menuLink"
          :index="item.link"
          :key="item.index"
        >
          <i class="el-icon-document"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
function menuItem() {
  const mode = location.hash.substr(1, location.hash.length - 1);
  return mode;
}

export default {
  computed: {
    menuLink: function () {
      return [
        { index: "1", link: "/Doc/Instruction", label: this.$t("instruction") },
        { index: "2", link: "/Doc/WhitePaper", label: this.$t("white-paper") },
      ];
    },
  },
  data() {
    return {
      menuIndex: menuItem()
    }
    
  },
  methods: {
    handleSelect: function (key) {
      this.menuIndex = key;
    },
  },
};
</script>