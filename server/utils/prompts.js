class Prompts {
  textToObject(userInput) {
    return `
        Erstelle mir aus diesem Text """${userInput}""" ein JSON Array.
        WICHTIG!: Gebe deine Antwort ausschließlich als JSON Array,  Format: items : [{name(string), amount(number), unit(string) kcal(number), protein(number), carbohydrates(number), fat(number),healthyRating(Number:bewertung wie gesund es ist, 1 ist ungesund, 2 neutral und 3 gesund)}]
        Antworte mir bitte auf deutsch.
        Schätze die Kalorien im Zweifel im höheren bereich, ausser die Kalorien stehen mit dabei.
        Kcal angaben sind gleich zu setzen mit Kalorien.
        Falls der Text schon eine eine Kalorienangabe macht, dann nimm exakt diese ohne zu Runden.
        Wenn der Name länger ist, dann kürze ihn sinnvoll. 
        Nehme dir Zeit den Text zu analysieren und überlege zuvor, um eine genaue Einschätzung zu haben:
        - bei fertigen Produkten welche Zutaten diese beinhalten könnten und in welcher Menge. 
        - bei den Mengenangaben wie groß diese Menge sein könnte, als Beispiel bei einer Hand voll überlegst du welche Menge in eine Hand passt.
        - wie sich die Kalorien zusammensetzen.
        - was ich mit meinem Text genau in meine Kalorienzähler App eintragen möchte.

        hier sind Beispiele:
        - "Ein Glas Wasser" -> [{name: "Wasser", amount: 1, unit: "Glas", kcal: 0, protein: 0, carbohydrates: 0, fat: 0, healthyRating: 2}]
        - "300 Gramm Äpfel, die haben jeweils 300 Kalorien auf 100 gramm" -> [ { "name": "Äpfel", "amount": 300, "unit": "g", "kcal": 900, "protein": 1.5, "carbohydrates": 57, "fat": 0.9, "healthyRating": 3 } ]

        `;
  }

  askKaloTrack(question, jsonPayload) {
    return `
        Ich habe eine Frage zur Ernährung bzw meiner Kalorienzähler Liste die mir sagt ich soll heute noch:
        ${Math.round(jsonPayload.rest.kcal)} Kalorien, 
        ${Math.round(jsonPayload.rest.protein)}g Protein, 
        ${Math.round(jsonPayload.rest.fat)}g Fett,
        und ${Math.round(jsonPayload.rest.carbs)}g Kohlenhydrate konsumieren.

        Nehme dir bitte Zeit die Frage sinnvoll und korrekt zu benantworten und berücksichtige diese Anforderungen:
        - Beschränke deine Antwort auf 600 Zeichen und wirklich nur auf die gestellte Frage.
        - Wenn du Nährwertangaben schätzen musst darfst du das gerne.
        - Wiederhole die Frage nicht sondern gib ausschließlich eine Antwort.
        - Wenn die Frage nicht plausibel ist dann antworte mit "Tut mir leid darauf kann ich nicht antworten."
  
        Wenn ich dich frage worauf du antwortest dann sagst du das zur Kalorienzählerliste und Ernährungfragen antwortest.
        Meine Frage lautet: ${question}
        `;
  }

  createTrainingPlain(
    amountPlans,
    weight,
    gender,
    level,
    type,
    focus,
    duration,
    amountExercises,
    additional,
    gym
  ) {
    return `
        Erstelle mir ${amountPlans} Trainingspläne, 
        ich wiege ${weight} kg, 
        bin ${gender}, 
        ${level}
        und brauche Pläne für ${type}. 
        Mein Fokus liegt auf ${focus}.
        Ein Training sollte ungefähr ${duration} Minuten dauern${amountExercises}
        ${additional}
        ${gym}
        Gebe deine Antwort ausschließlich als JSON Array wie folgt:
        [{name(String(soll infos über die trainierte Muskelgruppe enthalten)),{codeName(String(erfinde einen kruzen, fancy codename fürs workout)), duration(Number(in minutes)), calories(Number), exercises(Array(Name(String),repetitions(Number),instructions(Array(auf deutsch)),Sets(Number),restBetweenReps(Number(in seconds)),restBetweenSets(Number(in secounds)))}]
        `;
  }
}

module.exports = Prompts;
