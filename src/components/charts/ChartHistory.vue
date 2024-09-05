<template>
  <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
</template>
  
<script>


export default {
  props: {
    archive: Array,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        xaxis: {
          labels: {
            show: false,
          }
        },
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: 'Letzte 14 Einträge'
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1]
        },
        yaxis: [
          {
            title: {
              text: 'Kalorienzufuhr %',
            },
          },
          {
            opposite: true,
            title: {
              text: 'Gewicht (kg)',

            },
          }
        ]
      },
    }
  },
  created() {
    const series = this.transformData(this.archive, 14);
    this.scaleWeightAxis();
    this.series = series.series;
  },
  watch: {
    items(newItems) {
      this.calculateKcal(newItems);
    },
    kcalSuggested() {
      this.calculateKcal(this.items);
    }
  },
  methods: {
    scaleWeightAxis() {
      const range = 15;
      const bodyData = localStorage.getItem('bodyData');
      let weight = parseInt(JSON.parse(bodyData).weight);

      if (!weight) { weight = 100; }

      this.chartOptions.yaxis[1].min = weight - range;
      this.chartOptions.yaxis[1].max = weight + range;
    },
    transformData(array, numResults) {
      if (typeof numResults !== 'number' || numResults <= 0) {
        throw new Error('Die Anzahl der zu berücksichtigenden Ergebnisse muss eine positive Zahl sein.');
      }

      const result = {
        series: [
          {
            name: 'Kalorienzufuhr %',
            type: 'column',
            data: []
          },
          {
            name: 'Gewicht kg',
            type: 'line',
            data: []
          }
        ],
        labels: []
      };

      const dateKcalMap = {};
      const dateSuggestedKcalMap = {};

      const startIndex = Math.max(0, array.length - numResults);

      array.slice(startIndex).forEach(item => {
        const date = item.date;
        const weight = item.bodyData.weight;

        if (!dateKcalMap[date]) {
          dateKcalMap[date] = 0;
        }
        if (!dateSuggestedKcalMap[date]) {
          dateSuggestedKcalMap[date] = 0;
        }

        if (item.kcalSuggested) {
          dateSuggestedKcalMap[date] = item.kcalSuggested;
        } else {
          dateSuggestedKcalMap[date] = 2000;
        }


        if (item.items && item.items.length > 0) {
          item.items.forEach(subItem => {
            // Berechne die Kalorien aus den "items"
            dateKcalMap[date] += subItem.kcal;

          });
        }

        if (!result.labels.includes(date)) {
          result.labels.push(date);
        }

        result.series[1].data.push(weight);

        const percentageDifference = 100 / dateSuggestedKcalMap[date] * dateKcalMap[date];
        result.series[0].data.push(Math.round(percentageDifference));
      });

      return result;
    }
  }
}
</script>

<style scoped>
.chart {
  width: auto;
  margin-left: -15px;
}
</style>
  
