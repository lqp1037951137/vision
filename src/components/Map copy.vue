<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      const initOption = {};
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$http.get("map");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const dataOption = {};
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      // const this.$refs.map_ref.offset.width
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
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
