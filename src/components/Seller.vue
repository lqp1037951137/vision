<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: null
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
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      const initOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: 20
        },
        grid: {
          top: "20%",
          left: "3%",
          right: "6%",
          bottom: "3%",
          containLabel: true //距离包括文字
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2d3443"
            }
          }
        },
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white"
              }
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052ee"
                },
                {
                  offset: 1,
                  color: "#ab6ee5"
                }
              ])
            }
          }
        ]
      };
      this.chartInstance.setOption(initOption);

      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData() {
      const { data } = await this.$http.get("seller");
      this.allData = data;
      this.allData.sort((a, b) => a.value - b.value);
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map(item => item.name);
      const sellerValues = showData.map(item => item.value);
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    screenAdapter() {
      // const this.$refs.seller_ref.offset.width
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    }
  },
  computed: {
    ...mapState(["theme"])
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
    clearInterval(this.timerId);
    window.removeEventListener("resize", this.screenAdapter);
  }
};
</script>

<style></style>
