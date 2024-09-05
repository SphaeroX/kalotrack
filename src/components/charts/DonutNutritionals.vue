<template>
    <apexchart type="donut" class="donut" :options="options" :series="series">
    </apexchart>
</template>

<script>
export default {
    props: {
        items: Array,
        kcalSuggested: Number, // Geändert von String zu Number
    },
    data() {
        return {
            kcalTotal: null,
            kcalTotalPercent: null,
            options: {
                title: {
                    text: 'Nährwertverteilung heute',
                },
                legend: {
                    position: 'bottom',
                    padding: {
                        left: -20,
                    },
                },
                labels: ['Protein', 'Kohlenhydrate', 'Fett'],
                colors: ["#C14242", "#3F7FBF", "#3FBF3F"],
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                value: {
                                    offsetY: -10,
                                },
                                show: true,
                                total: {
                                    show: true,
                                    color: "#000000",
                                    label: '',
                                    formatter: function () {
                                        return "Nährwerte";
                                    },
                                },
                            },
                        },
                    },
                },
            },
            series: [],
        };
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
        },
    },
    methods: {
        calculateKcal(items) {
            const kcalTotal = items.reduce((total, item) => total + item.kcal, 0);
            const kcalTotalPercent = (100 / this.kcalSuggested) * kcalTotal;

            this.kcalTotal = kcalTotal;
            this.kcalTotalPercent = kcalTotalPercent;

            let series = [0, 0, 0];

            items.forEach((item) => {
                series[0] += item.protein; // Korrektur: += statt =+
                series[1] += item.carbohydrates; // Korrektur: += statt += series[0] +
                series[2] += item.fat; // Korrektur: += statt += series[0] +
            });

            this.series = series;
        },
    },
};
</script>

<style scoped>
.donut {
    width: auto;
    margin-left: -15px;
}
</style>