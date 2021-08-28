<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>▎ {{ showTitle }}</span>
      <span
        class="iconfont title-icon "
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: "map",
      titleFontSize: 0
    };
  },
  created() {
    this.$socket.registerCallBack("trendData", this.getData);
  },
  mounted() {
    this.initChart();
    //this.getData();
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: ""
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme);
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle"
        },
        xAxis: {
          type: "category",
          boundaryGap: false
        },
        yAxis: {
          type: "value"
        }
      };
      this.chartInstance.setOption(initOption);
    },
    async getData(ret) {
      // const { data } = await this.$http.get("trend");
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      const colorArr1 = [
        "rgb(11,168,44,0.5)",
        "rgb(44,110,255,0.5)",
        "rgb(22,242,217,0.5)",
        "rgb(254,33,30,0.5)",
        "rgb(250,105,0,0.5)"
      ];
      const colorArr2 = [
        "rgb(11,168,44,0)",
        "rgb(44,110,255,0)",
        "rgb(22,242,217,0)",
        "rgb(254,33,30,0)",
        "rgb(250,105,0,0)"
      ];
      const timeArr = this.allData.common.month;
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        };
      });
      const legendArr = valueArr.map(item => item.name);
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;

      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize 
          }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updateChart();
      this.showChoice = false;
    }
  },
  computed: {
    ...mapState(["theme"]),
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter(item => item.key !== this.choiceType);
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      }
      return this.allData[this.choiceType].title;
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: this.theme === "chalk" ? "white" : "black",
        background: this.theme === "chalk" ? "#222733" : "white"
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px"
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
    this.$socket.unRegisterCallBack("trendData");
  }
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    // background: #222733;
  }
}
</style>
