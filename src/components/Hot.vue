<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle"
      >&#xe6ef;</span
    >
    <span class="iconfont arr-right" @click="toRight" :style="comStyle"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "▎热销商品的占比",
          left: 20,
          top: 20
        },
        legend: {
          top: "15%",
          icon: "circle"
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach(item => {
              total += item.value;
            });
            let retStr = "";
            thirdCategory.forEach(item => {
              retStr += `
              ${item.name}:${parseInt((item.value / total) * 100)}%
              <br>
              `;
            });
            return retStr;
          }
        },
        series: [
          {
            type: "pie",
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$http.get("hotproduct");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        item => item.name
      );
      const seriesData = this.allData[this.currentIndex]
        .children; /*.map(item => {
        return {
          name: item.name,
          value: item.value
        };
      });*/
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.125
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"]
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    }
  },
  computed: {
    ...mapState(["theme"]),
    catName() {
      if (!this.allData) {
        return "";
      }
      return this.allData[this.currentIndex].name;
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize * 2 + "px",
        color: this.theme === "chalk" ? "white" : "black"
      };
    }
  },
  watch: {
    theme() {
      console.log("主题切换");
      this.chartInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updateChart();
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  }
};
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
}
</style>
