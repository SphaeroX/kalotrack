<template>
  <v-card class="mx-auto" title="Kalorienbedarf ermitteln">
    <v-container>
      <v-text-field v-model="height" color="primary" label="* Größe (cm)" variant="underlined" required></v-text-field>

      <v-text-field v-model="weight" color="primary" label="* Gewicht (kg)" variant="underlined"></v-text-field>

      <v-text-field v-model="age" color="primary" label="* Alter (Jahre)" variant="underlined"></v-text-field>

      <v-select v-model="gender" color="primary" label="Geschlecht" variant="underlined" :items="genderOptions"></v-select>

      <v-text-field v-model="workHours" color="primary" label="Arbeitsstunden pro Woche" variant="underlined"></v-text-field>

      <v-select v-model="workIntensity" color="primary" label="Beruf" variant="underlined" :items="workIntensityOptions"></v-select>

      <v-text-field v-model="manualPAL" color="primary" label="Manueller PAL-Wert (optional)" variant="underlined"></v-text-field>

      <v-select v-model="dietLevel" color="primary" label="Diätziel" variant="underlined" :items="dietLevelOptions"></v-select>

      <v-select v-model="dietType" color="primary" label="Diätart" variant="underlined" :items="dietTypeOptions"></v-select>

      <v-text-field v-model="customDietLevel" color="primary" label="Benutzerdefiniertes Diätziel (%)" variant="underlined" type="number"></v-text-field>

    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn @click="calculate" class="mb-5" color="success">
        Berechnen

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>

    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="auto">
        <v-card>
          <v-card-title class="text-h5">Vorschlag</v-card-title>
          <v-card-text>
            <p>Durchschnittlicher Tagesbedarf: <strong>{{ kcalPerDay }} kCal</strong></p>
            <p>
              Fett({{ nutrientSuggested.fat }}g),
              Kohlenhydrate({{ nutrientSuggested.carbs }}g),
              Protein({{ nutrientSuggested.protein }}g)
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red-darken-1" variant="text" @click="dialog = false">
              Verwerfen
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="updateBodyData">
              Übernehmen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from '@/stores/mainStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useMainStore();
store.initialize();

const height = ref(store.bodyData?.height || '');
const weight = ref(store.bodyData?.weight || '');
const age = ref(store.bodyData?.age || '');
const gender = ref(store.bodyData?.gender || 'male');
const workHours = ref(store.bodyData?.workHours || 0);
const workIntensity = ref(store.bodyData?.workIntensity || '');
const manualPAL = ref(store.bodyData?.manualPAL || "");
const dietLevel = ref(store.bodyData?.dietLevel || 0);
const dietType = ref(store.bodyData?.dietType || "balanced");
const customDietLevel = ref(store.bodyData?.customDietLevel || '');
const nutrientSuggested = ref(store.nutrientSuggested);
const kcalPerDay = ref(store.kcalSuggested?.customDietLevel || 0);

const dialog = ref(false);
const dietLevelOptions = [
  { title: 'Stark abnehmen (-25%)', value: -25 },
  { title: 'Etwas abnehmen (-15%)', value: -15 },
  { title: 'Halten', value: 0 },
  { title: 'Leichter Aufbau (+10%)', value: 10 },
  { title: 'Starker Aufbau (+15%)', value: 15 },
];

const dietTypeOptions = [
  { title: 'Wenig Kohlenhydrate', value: "lowCarb" },
  { title: 'Ausgewogen', value: "balanced" },
  { title: 'Wenig Fett', value: "lowFat" },
];
const genderOptions = [
  { title: "Männlich", value: "male" },
  { title: "Weiblich", value: "female" },
];

const workIntensityOptions = [
  { title: "Home-Office (1.2 PAL) – sitzend, keine körperliche Aktivität", value: 1.2 },
  { title: "Büroangestellter (1.3 PAL) – sitzend, geringe Bewegung", value: 1.3 },
  { title: "Lehrer (1.4 PAL) – moderates Gehen, Stehen", value: 1.4 },
  { title: "Verkäufer (1.5 PAL) – stehend, gehend, leichte körperliche Arbeit", value: 1.5 },
  { title: "Kellner (1.6 PAL) – viel Gehen, Tragen von Tellern", value: 1.6 },
  { title: "Pflegekraft (1.7 PAL) – häufiges Gehen, Heben von Patienten", value: 1.7 },
  { title: "Bauarbeiter (1.8 PAL) – körperlich anstrengend, Heben, Tragen", value: 1.8 },
  { title: "Landwirt (1.9 PAL) – körperliche Arbeit, Heben, Maschinenbedienung", value: 1.9 },
  { title: "Sportlehrer (2.0 PAL) – aktiv, Vormachen von Übungen", value: 2.0 },
  { title: "Baustelle (2.2 PAL) – schwere körperliche Arbeit, Heben, Stehen", value: 2.2 },
  { title: "Bergführer (2.4 PAL) – extreme Aktivität, langes Gehen im Gelände", value: 2.4 },
];

const calculateWeightedPAL = (workHours, workPAL) => {
  if (!workHours || workHours <= 0) {
    return 0; // Wenn keine Arbeitsstunden angegeben sind, verwenden wir direkt den workPAL
  }

  const workDays = 5; // Annahme: 5-Tage-Arbeitswoche
  const totalWeekHours = 24 * 7;
  const workWeekHours = workHours * workDays;
  const nonWorkHours = totalWeekHours - workWeekHours;

  // PAL für Nicht-Arbeitszeit (angenommen als 1.4 für moderate Aktivität)
  const nonWorkPAL = 1.2;

  return (workPAL * workWeekHours + nonWorkPAL * nonWorkHours) / totalWeekHours;
};


const calculate = () => {
  if (!height.value || !weight.value || !age.value) {
    alert("Alle Felder müssen ausgefüllt sein");
    return;
  }

  const workPAL = parseFloat(workIntensity.value);
  const weightedPAL = calculateWeightedPAL(parseFloat(workHours.value), workPAL);
  const bmr = calculateBMR(height.value, weight.value, age.value, gender.value);


  let dailyKcal = weightedPAL !== 0 ? Math.round(bmr * weightedPAL) : Math.round(bmr);

  // Anwendung des Diätziels
  const dietPercentage = customDietLevel.value !== '' ? parseFloat(customDietLevel.value) : dietLevel.value;
  dailyKcal = Math.round(dailyKcal * (1 + dietPercentage / 100));

  kcalPerDay.value = dailyKcal;

  const nutrientSuggestedData = calculateNutrientDistribution(dailyKcal, dietType.value);
  nutrientSuggested.value = nutrientSuggestedData;

  dialog.value = true;
};


const calculateBMR = (height, weight, age, gender) => {
  // Mifflin-St Jeor Formel für den Grundumsatz (BMR)
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const calculateNutrientDistribution = (kcal, dietType) => {
  let nutrientDistribution = {};

  // low carb
  if (dietType === "lowCarb") {
    nutrientDistribution.carbs = (0.1 * kcal) / 4;
    nutrientDistribution.protein = (0.2 * kcal) / 4;
    nutrientDistribution.fat = (0.7 * kcal) / 9;
  }
  // balanced
  else if (dietType === "balanced") {
    nutrientDistribution.carbs = (0.4 * kcal) / 4;
    nutrientDistribution.protein = (0.3 * kcal) / 4;
    nutrientDistribution.fat = (0.3 * kcal) / 9;
  }
  // low fat
  else if (dietType === "lowFat") {
    nutrientDistribution.carbs = (0.6 * kcal) / 4;
    nutrientDistribution.protein = (0.2 * kcal) / 4;
    nutrientDistribution.fat = (0.2 * kcal) / 9;
  } else {
    return "Invalid nutrition type.";
  }

  nutrientDistribution.carbs = Math.round(nutrientDistribution.carbs);
  nutrientDistribution.protein = Math.round(nutrientDistribution.protein);
  nutrientDistribution.fat = Math.round(nutrientDistribution.fat);

  return nutrientDistribution;
}

const updateBodyData = () => {
  store.bodyData = {
    height: height.value,
    weight: weight.value,
    age: age.value,
    gender: gender.value,
    workHours: workHours.value,
    workIntensity: workIntensity.value,
    manualPAL: manualPAL.value,
    dietLevel: dietLevel.value,
    dietType: dietType.value,
    customDietLevel: customDietLevel.value,
  };

  console.log('nutrientSuggested.value', nutrientSuggested.value);

  store.kcalSuggested = kcalPerDay.value;
  store.nutrientSuggested = nutrientSuggested.value;
  store.updateBodyData();

  dialog.value = false;

  router.push('/');
};
</script>

<style scoped></style>
