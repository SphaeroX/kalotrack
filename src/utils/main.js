export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}${month}${day}`;
  return formattedDate;
}

export function calculateCalories(
  height,
  weight,
  age,
  gender,
  bodyFatLevel,
  weeklyExerciseHours,
  exerciseIntensity,
  stressLevel,
  sleepHours,
  workHours,
  workIntensity
) {
  height = validateInput(height);
  weight = validateInput(weight);
  age = validateInput(age);
  weeklyExerciseHours = validateInput(weeklyExerciseHours);
  sleepHours = validateInput(sleepHours);
  workHours = validateInput(workHours);
  workIntensity = validateInput(workIntensity);
  exerciseIntensity = validateInput(exerciseIntensity);
  stressLevel = validateInput(stressLevel);

  // Basal metabolic rate (BMR) calculation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Body fat level adjustment
  let bodyFatAdjustment;
  switch (bodyFatLevel) {
    case 1:
      bodyFatAdjustment = 1.1;
      break;
    case 2:
      bodyFatAdjustment = 1.05;
      break;
    case 3:
      bodyFatAdjustment = 1;
      break;
    case 4:
      bodyFatAdjustment = 0.95;
      break;
    case 5:
      bodyFatAdjustment = 0.9;
      break;
    default:
      bodyFatAdjustment = 1;
  }

  // Exercise adjustment
  let exerciseAdjustment = (weeklyExerciseHours * exerciseIntensity * 50) / 7;

  // Stress adjustment
  let stressAdjustment = stressLevel * 100;

  // Sleep adjustment
  let sleepAdjustment;
  if (sleepHours != 0) {
    sleepAdjustment = (8 - sleepHours) * 50;
  } else {
    sleepAdjustment = 0;
  }

  // Work adjustment
  let workAdjustment = (workHours * workIntensity * 10) / 7;

  // Total daily calorie needs
  let totalDailyCalorieNeeds =
    bmr * bodyFatAdjustment +
    exerciseAdjustment +
    stressAdjustment -
    sleepAdjustment +
    workAdjustment;

  return Math.round(totalDailyCalorieNeeds);
}

export function calculateNutrientDistribution(calories, nutritionType) {
  let nutrientDistribution = {};

  // low carb
  if (nutritionType === 1) {
    nutrientDistribution.carbs = (0.1 * calories) / 4;
    nutrientDistribution.protein = (0.2 * calories) / 4;
    nutrientDistribution.fat = (0.7 * calories) / 9;
  }
  // balanced
  else if (nutritionType === 2) {
    nutrientDistribution.carbs = (0.4 * calories) / 4;
    nutrientDistribution.protein = (0.3 * calories) / 4;
    nutrientDistribution.fat = (0.3 * calories) / 9;
  }
  // low fat
  else if (nutritionType === 3) {
    nutrientDistribution.carbs = (0.6 * calories) / 4;
    nutrientDistribution.protein = (0.2 * calories) / 4;
    nutrientDistribution.fat = (0.2 * calories) / 9;
  } else {
    return "Invalid nutrition type.";
  }

  nutrientDistribution.carbs = Math.round(nutrientDistribution.carbs);
  nutrientDistribution.protein = Math.round(nutrientDistribution.protein);
  nutrientDistribution.fat = Math.round(nutrientDistribution.fat);

  return nutrientDistribution;
}

export function calculateDietCalories(calories, dietLevel) {
  let multiplier = null;

  switch (dietLevel) {
    case 1:
      multiplier = 0.75;
      break;
    case 2:
      multiplier = 0.85;
      break;
    case 3:
      multiplier = 1;
      break;
    case 4:
      multiplier = 1.1;
      break;
    case 5:
      multiplier = 1.15;
      break;

    default:
      multiplier = 1;
      break;
  }

  const dietCalories = Math.round(calories * multiplier);

  return dietCalories;
}

function validateInput(input) {
  input = String(input);

  if (!input) {
    return 0;
  }
  // Entfernen Sie alle Kommas und ersetzen Sie sie durch Punkte
  input = input.replace(",", ".");

  // Stellen Sie sicher, dass die Eingabe eine gültige Dezimalzahl ist
  if (isNaN(parseFloat(input))) {
    // Wenn die Eingabe keine gültige Dezimalzahl ist, setzen Sie das Feld auf null
    input = 0;
  }

  return input;
}
