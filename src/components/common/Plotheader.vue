<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <el-col id="logo" :lg="3" :md="4" :sm="6" :xs="0">
        <img
          style="width: 160px"
          src="../../../public/image/logo_000.png"
          alt="LOGO"
        />
      </el-col>
      <el-col
        id="menu"
        :lg="{ span: 8, offset: 4 }"
        :md="{ span: 9, offset: 1 }"
        :sm="12"
        :xs="14"
      >
        <el-menu
          :router="true"
          :default-active="this.menuIndex"
          text-color="#fff"
          mode="horizontal"
          background-color="#25272e"
        >
          <el-menu-item
            v-for="item in this.nav"
            :key="item.link"
            :index="item.link"
            >{{ item.tag }}
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col id="connect" :lg="3" :md="5" :sm="4" :xs="5">
        <ConnectButton />
      </el-col>
      <el-col id="changelang" :lg="3" :md="5" :sm="5" :xs="5">
        <el-select v-model="lang">
          <el-option
            v-for="item in langs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ConnectButton from "../lib/ConnectWalletButton.vue";
import { mapState } from "vuex";
import { i18n, setup } from "../../locales";

function versions() {
  const vs = {};
  vs.App = process.env.VUE_APP_MY_VERSION;
  const dep = JSON.parse(process.env.VUE_APP_DEP_VERSIONS);
  for (let n in dep) {
    const v = dep[n].split("/");
    if (v.length > 1) {
      const f = v[1].split("#");
      if (f.length > 1) {
        vs[f[0]] = f[1];
      }
    }
  }
  console.log("vs=", vs);
  return vs;
}
function tags(path) {
  const mode = path.substr(1, path.length - 1);
  let tag = "";
  if (mode.indexOf("/") != -1) {
    tag = "/" + mode.substr(0, mode.indexOf("/"));
  } else {
    tag = "/" + mode;
  }
  return tag;
}
export default {
  name: "Plotheader",
  components: {
    ConnectButton,
  },
  computed: mapState({
    baddr: "baddr",
    myList: "myList",
    marketList: "marketList",
    nav() {
      return [
        { tag: this.$t("home"), link: "/Home" },
        { tag: this.$t("game"), link: "/Game" },
        { tag: this.$t("doc"), link: "/Doc" },
      ];
    },
    testnet: function (state) {
      if ("chain" in state.bsc) {
        if ("chainNetName" in state.bsc.chain) {
          switch (state.bsc.chain.chainNetName) {
            case "bnbt":
              return "(TESTNET)";
            case "bnb":
              return "";
            default:
              return `(${state.bsc.chain.chainNetName})`;
          }
        }
      }
      return "";
    },
    menuIndex() {
      const path = tags(this.$route.path);
      return path;
    },
  }),
  watch: {
    lang: function () {
      setup(this.lang);
    },
  },
  data() {
    return {
      langs: [
        { value: "en", label: "English" },
        { value: "zh", label: "简体中文" },
      ],
      lang: i18n.locale,
      versions: versions(),
    };
  },
  methods: {
    // selectTag: function (key) {
    //   this.$store.commit("setCurrentPbtId", false);
    // },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-col,
.el-option {
  color: #38f2af;
}

#menu,
#connect,
#logo,
#version,
#changelang {
  height: 90px;
  box-sizing: border-box;
  font-size: 16px;
}
#changelang {
  margin-top: 6px;
}
#changelang .el-select {
  width: 99%;
  margin: 0 auto;
  padding: 0px;
}
#connect .el-button {
  margin-top: 25px;
  background-color: #38f2af;
  color: #000000;
  width: 99%;
  height: 40px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  padding: 0px;
  box-shadow: 0px 2px 2px 0px rgba(56, 242, 175, 0.08);
}
#connect .baddr {
  color: #38f2af;
  width: 99%;
  margin: 0 auto;
  font-size: 16px;
  display: inline-block;
  margin: 0 auto;
}
#logo {
  padding-top: 15px;
}
#version {
  line-height: 30px !important;
  text-align: center;
}
#version span {
  display: block;
  float: left;
  margin: 5px 20px 0px;
}
#menu .el-menu {
  width: 95%;
  margin: 0 auto;
  height: 90px;
  border: none !important;
}
#menu .el-menu--horizontal > .el-menu-item {
  height: 90px;
  width: 14%;
  font-size: 15px;
  font-weight: 700;
  padding: 15px 0px;
}
#menu .el-menu--horizontal > .el-menu-item.is-active {
  color: #38f2af !important;
  border-bottom: #38f2af 2px solid !important;
}
</style>
