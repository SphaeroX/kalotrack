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
        - wenn bei zB bei Reis, Quinoa, Linsen, Couscous, Gerste, Bulgur, Nudeln nicht explizit ungekocht dran steht oder es sich um Gerichte handelt, nimm die gekochte Variante da diese mehr wiegen wegen dem Wasser und schreibe es auch so in den Name.

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

  imageToText() {
    return `
    Gebe mir in einem kurzen Satz wieder was für ein Essen du auf dem Bild siehst und wieviel, zB ein Teller voll mit Salat oder ein großes Stück Pizza Funghi.
    Halte dich so kurz wie möglich. Falls es ein Bild von Nährwertangaben ist, dann schreibe es wie folgt mit den richtigen Daten: 100g von xx mit xx Kalorien, xx fett, xx Protein und xx Carbs.
    Wenn du darauf ein Nudel/Reis etc Gericht siehst, dann sind die Nudeln vermutlich gekocht, deshalb gebe dann Nudeln gekocht zurück, also mit Zusatz
    `;
  }
}

module.exports = Prompts;
