<template>
  <div id="chart"></div>
</template>

<script>
import Circos from "circos";

export default {
  name: "CircosDisplay",
  data: () => ({
    circosInstance: null
  }),
  mounted() {
    this.circosInstance = new Circos({
      container: "#chart"
    });

    var configuration = {
      innerRadius: 250,
      outerRadius: 300,
      cornerRadius: 10,
      gap: 0.04, // in radian
      labels: {
        display: true,
        position: "center",
        size: "14px",
        color: "#000",
        radialOffset: 20
      },
      ticks: {
        display: true,
        color: "grey",
        spacing: 10000000,
        labels: true,
        labelSpacing: 10,
        labelSuffix: "Mb",
        labelDenominator: 1000000,
        labelDisplay0: true,
        labelSize: "10px",
        labelColor: "#fff",
        labelFont: "default",
        majorSpacing: 5,
        size: {
          minor: 2,
          major: 5
        }
      },
      events: {}
    };

    var data = [
      { len: 31, color: "#8dd3c7", label: "January", id: "january" },
      { len: 28, color: "#ffffb3", label: "February", id: "february" },
      { len: 31, color: "#bebada", label: "March", id: "march" },
      { len: 30, color: "#fb8072", label: "April", id: "april" },
      { len: 31, color: "#80b1d3", label: "May", id: "may" },
      { len: 30, color: "#fdb462", label: "June", id: "june" },
      { len: 31, color: "#b3de69", label: "July", id: "july" },
      { len: 31, color: "#fccde5", label: "August", id: "august" },
      { len: 30, color: "#d9d9d9", label: "September", id: "september" },
      { len: 31, color: "#bc80bd", label: "October", id: "october" },
      { len: 30, color: "#ccebc5", label: "November", id: "november" },
      { len: 31, color: "#ffed6f", label: "December", id: "december" }
    ];

    this.circosInstance.layout(data, configuration);

    this.circosInstance.render();
  }
};
</script>

<style lang="scss" scoped>
</style>