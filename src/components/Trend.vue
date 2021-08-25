<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null
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
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref);
      const initOption = {
        xAxis: {
          type: "category"
        },
        yAxis: {
          type: "value"
        }
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$http.get("trend");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const timeArr = this.allData.common.month;
      const valueArr = this.allData.map.data;
      const seriesArr = valueArr.map(item => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: "map"
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
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  }
};
</script>

<style></style>
