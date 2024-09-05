<template>
    <apexchart type="donut" class="donut" :options="options" :series="series">
    </apexchart>
</template>
  
<script>


export default {
    props: {
        items: Array,
        kcalSuggested: String,
    },
    data() {
        return {
            kcalTotal: null,
            kcalTotalPercent: null,
            options: {
                title: {
                    text: 'Kalorienqualität heute'
                },
                legend: {
                    position: 'bottom'
                },
                labels: ['schlecht', 'neutral', 'gut'],
                colors: ["#C14242", "#3F7FBF", "#3FBF3F"],
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                value: {
                                    offsetY: -5,
                                },
                                show: true,
                                total: {
                                    show: true,
                                    color: "#000000",
                                    label: 'Kalorien',
                                    formatter: function (w) {
                                        const total = w.globals.seriesTotals[0] + w.globals.seriesTotals[1] + w.globals.seriesTotals[2];
                                        return `${total}`;
                                    }
                                }
                            }
                        }
                    }
                }
            },
            series: [],

        }
    },
    created() {
        this.calculateKcal(this.items);
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
        calculateKcal(items) {
            const kcalTotal = items.reduce((total, item) => total + item.kcal, 0);
            const kcalTotalPercent = (100 / this.kcalSuggested) * kcalTotal;

            this.kcalTotal = kcalTotal;
            this.kcalTotalPercent = kcalTotalPercent;

            let series = [0, 0, 0];

            items.forEach((item) => {
                if (item.healthyRating === 1) {
                    series[0] += item.kcal;
                } else if (item.healthyRating === 2) {
                    series[1] += item.kcal;
                } else if (item.healthyRating === 3) {
                    series[2] += item.kcal;
                }
            });

            this.series = series;
        },
    }
}
</script>
  
<style scoped>
.donut {
    margin-left: -15px;
}
</style>
  