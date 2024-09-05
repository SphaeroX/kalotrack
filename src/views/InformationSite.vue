<template>
  <v-expansion-panels variant="accordion">
    <v-expansion-panel>
      <v-expansion-panel-title>Wie verwende ich den Kalorienrechner</v-expansion-panel-title>
      <v-expansion-panel-text>
        <iframe class="yt_video mb-7" src="https://www.youtube.com/embed/vQPBMnQQs_U?si=H3LZWsbxheWLX6nD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <p class="mb-3">
          Kalotracker fügt mithilfe von ChatGPT Essen hinzu und erfasst automatisch alle Daten. Der große Vorteil: Ihr müsst
          nur sagen, was ihr gegessen habt. Hier sind einige Beispiele:
        </p>
        <v-chip>Ich habe einen großen Teller Spaghetti gehabt.</v-chip>
        <v-chip>Ich hatte eben eine Handvoll Walnüsse.</v-chip>
        <v-chip>Füge einen Proteinshake mit 300 Kalorien hinzu.</v-chip>
        <v-chip>Ich hatte gerade bei McDonald's einen Big Mac</v-chip>
        <br /><br />
        <p>
          Zusätzlich könnt ihr auch Fragen stellen, ohne etwas hinzuzufügen.
        </p>
        <p>
          Bestehende Einträge können als täglich markiert werden, und sie werden automatisch am nächsten Tag erneut in der
          Liste angezeigt.
        </p>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Wie verwende ich Trainigspläne?</v-expansion-panel-title>
      <v-expansion-panel-text>
        <p class="mb-3">Wenn ihr bisher noch keine Pläne erstellt habt, könnt ihr unter "Pläne generieren" individuelle Pläne nach euren Bedürfnissen erstellen lassen. Sobald ihr Pläne generiert habt, werden sie euch übersichtlich angezeigt. Jeder Plan kann einzeln betrachtet werden, und ihr habt die Flexibilität, einzelne Pläne jederzeit zu löschen oder weitere hinzuzufügen.</p>
        <p class="mb-3">Unter den Übungen findet ihr ein blaues Info-Icon – falls ihr nicht sicher seid, wie eine Übung ausgeführt wird, könnt ihr mit einem Klick darauf alle notwendigen Informationen nachlesen.</p>
        <p>Nachdem ihr ein Training absolviert habt, könnt ihr es als "absolviert" markieren. Die verbrauchten Kalorien werden automatisch beim Kalorienzähler für den Tag gutgeschrieben.</p>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Kontakt</v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>
          Bei Fragen oder Anregungen können Sie mich gerne kontaktieren:
        </p>
        <p>
          E-Mail: <a href="mailto:prompt-engineered@protonmail.com">prompt-engineered@protonmail.com</a>
        </p>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>Daten zurücksetzen</v-expansion-panel-title>
      <v-expansion-panel-text>
        <p class="mb-3">Du kannst jederzeit alle Daten, die auf deinem Smartphone gespeichert sind, zurücksetzen, um die App in den Neuzustand zu versetzen. Hierfür klicke einfach auf den entsprechenden Button.</p>
        <ResetDataComponent />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>


<script setup>
import ResetDataComponent from '@/components/inputs/resetDataComponent.vue';
</script>

<style scoped>
.v-chip {
  margin-bottom: 5px;
}

.yt_video {
  width: 280px;
  height: 350px;
}
</style>
