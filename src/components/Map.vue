<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      const { data } = await axios.get(
        "http://localhost:8999/static/map/china.json"
      );
      this.$echarts.registerMap("china", data);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical"
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2e72bf",
            borderColor: "#333"
          }
        }
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name);
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            "http://localhost:8999" + provinceInfo.path
          );
          this.mapData[provinceInfo.key] = ret.data;
          this.$echarts.registerMap(provinceInfo.key, ret.data);
        }

        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    async getData() {
      const { data } = await this.$http.get("map");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allData.map(item => item.name);
      const seriesArr = this.allData.map(item => {
        return {
          type: "effectScatter",
          name: item.name,
          data: item.children,
          rippleEffect: {
            scale: 5,
            brushType: "stroke"
          },
          coordinateSystem: "geo"
        };
      });
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    revertMap() {
      const revertOption = {
        geo: {
          map: "china"
        }
      };
      this.chartInstance.setOption(revertOption);
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  }
};
</script>

<style></style>
