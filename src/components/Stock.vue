<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, this.theme);
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20
        }
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
      const { data } = await this.$http.get("stock");
      this.allData = data;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"]
      ];
      const colorArr = [
        ["#4ff778", "#0ba82c"],
        ["#e5dd45", "#e8811c"],
        ["#e8821c", "#e55445"],
        ["#5052ee", "#ab6ee5"],
        ["#23e5e5", "#2e72bf"]
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          // radius: [10, 10],
          center: centerArr[index],
          label: {
            position: "center",
            color: colorArr[index][1]
          },
          data: [
            {
              value: item.sales,
              name: item.name + "\n\n" + item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843"
              }
            }
          ],
          hoverAnimation: false,
          labelLine: {
            show: false
          }
        };
      });
      const dataOption = {
        series: seriesArr
      };
      this.chartInstance.setOption(dataOption);
    },

    screenAdapter() {
      // const this.$refs.stock_ref.offset.width
      const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 3;
      const outterRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.5
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 5000);
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
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  }
};
</script>

<style></style>
