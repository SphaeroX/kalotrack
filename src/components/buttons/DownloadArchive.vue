<template>
    <v-btn @click="downloadCSV">Archive CSV</v-btn>
</template>

<script setup>
import { useMainStore } from '@/stores/mainStore';
import { ref } from 'vue';

const store = useMainStore();
const archive = ref(store.archive);

const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + convertArrayToCSV(archive.value);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "archive.csv");
    document.body.appendChild(link);
    link.click();
};

const convertArrayToCSV = (array) => {
    let csv = "";
    // Add header row
    csv += `Date,Name,Amount,Unit,Kcal,Protein,Carbohydrates,Fat,HealthyRating,Daily,KcalSuggested,NutrientSuggestedCarbs,NutrientSuggestedFat,NutrientSuggestedProtein,Height,Weight,Age,Gender,BodyFatLevel,WeeklyExerciseHours,ExerciseIntensity,StressLevel,SleepHours,WorkHours,WorkIntensity\n`;

    array.forEach(item => {
        const date = item.date;
        const kcalSuggested = item.kcalSuggested;
        const nutrientSuggested = item.nutrientSuggested;
        const bodyData = item.bodyData;

        item.items.forEach(i => {
            csv += `${date},${i.name},${i.amount},${i.unit},${i.kcal},${i.protein},${i.carbohydrates},${i.fat},${i.healthyRating},${i.daily},${kcalSuggested},${nutrientSuggested.carbs},${nutrientSuggested.fat},${nutrientSuggested.protein},${bodyData.height},${bodyData.weight},${bodyData.age},${bodyData.gender},${bodyData.bodyFatLevel},${bodyData.weeklyExerciseHours},${bodyData.exerciseIntensity},${bodyData.stressLevel},${bodyData.sleepHours},${bodyData.workHours},${bodyData.workIntensity}\n`;
        });
    });

    return csv;
};
</script>

<style scoped></style>
