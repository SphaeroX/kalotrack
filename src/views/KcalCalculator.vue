<template>
  <v-card class="mx-auto" title="Kalorienbedarf ermitteln">
    <v-container>
      <v-text-field v-model="height" ref="heightField" color="primary" label="* Größe (cm)" variant="underlined"
        required></v-text-field>

      <v-text-field v-model="weight" ref="weightField" color="primary" label="* Gewicht (kg)"
        variant="underlined"></v-text-field>

      <v-text-field v-model="age" ref="ageField" color="primary" label="* Alter (jahre)"
        variant="underlined"></v-text-field>

      <v-select v-model="gender" color="primary" label="Geschlecht" variant="underlined"
        :items="genderOptions"></v-select>

      <v-select v-model="bodyFatLevel" color="primary" label="Body Fat Level" variant="underlined"
        :items="bodyFatOptions"></v-select>

      <v-text-field v-model="weeklyExerciseHours" color="primary" label="Wöchentliche Sportstunden"
        variant="underlined"></v-text-field>

      <v-select v-model="exerciseIntensity" color="primary" label="Intensitätlevel der Sportstunden"
        variant="underlined" :items="intensityOptions"></v-select>

      <v-select v-model="stressLevel" color="primary" label="Stress Level" variant="underlined"
        :items="stressOptions"></v-select>

      <v-text-field v-model="sleepHours" color="primary" label="Durschnittlicher Schlaf in Stunden"
        variant="underlined"></v-text-field>

      <v-text-field v-model="workHours" color="primary" label="Arbeitsstunden pro Woche"
        variant="underlined"></v-text-field>

      <v-select v-model="workIntensity" color="primary" label="Arbeitsintensität" variant="underlined"
        :items="workIntensityOptions"></v-select>

      <v-select v-model="dietLevel" color="primary" label="Dein Ziel" variant="underlined"
        :items="dietLevelOptions"></v-select>

      <v-select v-model="diet" color="primary" label="Ernährungsform" variant="underlined"
        :items="dietOptions"></v-select>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn @click="calculate" color="success">
        Berechnen

        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="auto">
      <v-card>
        <v-card-title class="text-h5">
          Kalorienvorschlag
        </v-card-title>
        <v-card-text>
          <p>
            Vorschlag: <strong>{{ kcalSuggested }} kCal</strong>
          </p>
          <p>
            Fett({{ nutrientSuggested.fat }}g),
            Kohlenhydrate({{ nutrientSuggested.carbs }}g),
            Protein({{ nutrientSuggested.protein }}g)
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" variant="text" @click="dialog = false">
            Nein
          </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="updateBodyData">
            Ja
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import { calculateCalories, calculateDietCalories, calculateNutrientDistribution } from '@/utils/main.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useMainStore();
store.initialize();


const height = ref(store.bodyData?.height || '');
const weight = ref(store.bodyData?.weight || '');
const age = ref(store.bodyData?.age || '');
const gender = ref(store.bodyData?.gender || 'male');
const bodyFatLevel = ref(store.bodyData?.bodyFatLevel || 3);
const weeklyExerciseHours = ref(store.bodyData?.weeklyExerciseHours || '');
const exerciseIntensity = ref(store.bodyData?.exerciseIntensity || '');
const stressLevel = ref(store.bodyData?.stressLevel || 3);
const sleepHours = ref(store.bodyData?.sleepHours || '');
const workHours = ref(store.bodyData?.workHours || '');
const workIntensity = ref(store.bodyData?.workIntensity || '');
const dietLevel = ref(store.bodyData?.dietLevel || 3);
const diet = ref(store.bodyData?.diet || 2);
const dialog = ref(false);
const kcalSuggested = ref(store.kcalSuggested);
const nutrientSuggested = ref(store.nutrientSuggested);

const genderOptions = [
  { title: 'männlich', value: 'male' },
  { title: 'weiblich', value: 'female' },
];

const bodyFatOptions = [
  { title: 'Schwere Fettzunahme', value: 1 },
  { title: 'Erschwerte Fettzunahme', value: 2 },
  { title: 'Normale Fettzunahme', value: 3 },
  { title: 'Erhöhte Fettzunahme', value: 4 },
  { title: 'Schnelle Fettzunahme', value: 5 },
];

const intensityOptions = [
  { title: 'Sehr Leicht', value: 1 },
  { title: 'Leicht', value: 2 },
  { title: 'Neutral', value: 3 },
  { title: 'Hoch', value: 4 },
  { title: 'Sehr Hoch', value: 5 },
];

const stressOptions = [
  { title: 'Sehr Leicht', value: 1 },
  { title: 'Leicht', value: 2 },
  { title: 'Neutral', value: 3 },
  { title: 'Hoch', value: 4 },
  { title: 'Sehr Hoch', value: 5 },
];

const workIntensityOptions = [
  { title: 'Nur sitzend', value: 1 },
  { title: 'Sitzend und stehend', value: 2 },
  { title: 'Stehend, leichte Bewegung', value: 3 },
  { title: 'Stehend mit Tätigkeiten', value: 4 },
  { title: 'Schwere Arbeit', value: 5 },
];

const dietLevelOptions = [
  { title: 'Stark abnehmen (-25%)', value: 1 },
  { title: 'Etwas abnehmen (-15%)', value: 2 },
  { title: 'Halten', value: 3 },
  { title: 'Leichter Aufbau (+10%)', value: 4 },
  { title: 'Starker Aufbau (+15%)', value: 5 },
];

const dietOptions = [
  { title: 'Wenig Kohlenhydrate', value: 1 },
  { title: 'Ausgewogen', value: 2 },
  { title: 'Wenig Fett', value: 3 },
];

const calculate = () => {
  if (!height.value || !weight.value || !age.value) {
    alert("Höhe, Gewicht und Alter sind Pflichtfelder");
    return;
  }

  store.bodyData = {
    height: height.value,
    weight: weight.value,
    age: age.value,
    gender: gender.value,
    bodyFatLevel: bodyFatLevel.value,
    weeklyExerciseHours: weeklyExerciseHours.value,
    exerciseIntensity: exerciseIntensity.value,
    stressLevel: stressLevel.value,
    sleepHours: sleepHours.value,
    workHours: workHours.value,
    workIntensity: workIntensity.value,
    dietLevel: dietLevel.value,
    diet: diet.value,
  };

  const totalCalories = calculateCalories(
    height.value,
    weight.value,
    age.value,
    gender.value,
    bodyFatLevel.value,
    weeklyExerciseHours.value,
    exerciseIntensity.value,
    stressLevel.value,
    sleepHours.value,
    workHours.value,
    workIntensity.value
  );

  const suggesedCalories = calculateDietCalories(totalCalories, dietLevel.value);
  kcalSuggested.value = Math.round(suggesedCalories);
  const nutrientSuggestedData = calculateNutrientDistribution(suggesedCalories, diet.value);
  nutrientSuggested.value = nutrientSuggestedData;
  store.kcalSuggested = kcalSuggested.value;
  store.nutrientSuggested = nutrientSuggestedData;

  dialog.value = true;
};

const updateBodyData = () => {
  store.bodyData = {
    height: height.value,
    weight: weight.value,
    age: age.value,
    gender: gender.value,
    bodyFatLevel: bodyFatLevel.value,
    weeklyExerciseHours: weeklyExerciseHours.value,
    exerciseIntensity: exerciseIntensity.value,
    stressLevel: stressLevel.value,
    sleepHours: sleepHours.value,
    workHours: workHours.value,
    workIntensity: workIntensity.value,
    dietLevel: dietLevel.value,
    diet: diet.value,
  };

  store.updateBodyData();
  dialog.value = false;

  router.push('/');
};

</script>

<style scoped></style>
