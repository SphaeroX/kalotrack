<template>
    <v-container>
        <div v-if="items.length === 0">
            <v-alert type="info">Heute wurde noch nichts getrackt.</v-alert>
        </div>
        <v-card class="card-with-margin" v-for="(item, index) in items" :key="index" :class="{
            'healthy-rating-low': item.healthyRating === 1,
            'healthy-rating-medium': item.healthyRating === 2,
            'healthy-rating-high': item.healthyRating === 3
        }">
            <v-card-title>{{ item.name }} {{ item.daily === 1 ? '(täglich)' : '' }}</v-card-title>
            <v-card-subtitle>{{ item.amount }} {{ item.unit }} ({{ item.kcal }} kcal)</v-card-subtitle>
            <v-menu activator="parent" transition="slide-y-transition">
                <v-list>
                    <v-list-item v-for="(menuItem, menuIndex) in menuItems" :key="menuIndex" :value="menuIndex"
                        @click="chooseMenu(index, menuIndex)">
                        <template v-slot:prepend>
                            <v-icon :color="getMenuItemColor(item, menuIndex)" :icon="menuItem.icon"></v-icon>
                        </template>
                        <v-list-item-title :color="menuItem.color">{{ menuItem.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card>
    </v-container>

    <!-- Dialog Change Amount -->
    <v-dialog v-model="dialogAmount" width="300px">
        <v-card>
            <v-card-text>
                <v-text-field v-model="dialogAmountCount" color="primary" label="Anzahl eingeben" type="number"
                    variant="underlined" @focus="$event.target.select()"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" block @click="changeItemAmount()">Speichern</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

const items = computed(() => store.items);
const menuItems = ref([
    { title: 'Anzahl ändern', icon: 'mdi-pencil' },
    { title: 'Täglich', icon: 'mdi-infinity' },
    { title: 'Entfernen', icon: 'mdi-delete-empty', color: 'red' },
]);
const dialogAmount = ref(false);
const dialogAmountId = ref(null);
const dialogAmountCount = ref(null);

const getMenuItemColor = (item, menuIndex) => {
    if (menuIndex === 1 && item.daily === 1) {
        return 'green';
    }
    if (menuIndex === 2) {
        return 'red';
    }
    return '';
};

const chooseMenu = (itemIndex, menuIndex) => {
    if (menuIndex === 0) {
        dialogAmount.value = true;
        dialogAmountId.value = itemIndex;
        dialogAmountCount.value = items.value[itemIndex].amount;
    }

    if (menuIndex === 1) {
        toggleDailyItem(itemIndex);
    }

    if (menuIndex === 2) {
        store.deleteItem(itemIndex);
    }
};

const toggleDailyItem = (itemIndex) => {
    const updatedItems = [...items.value];
    updatedItems[itemIndex].daily = updatedItems[itemIndex].daily === 1 ? 0 : 1;
    store.updateItems(updatedItems);
};

const changeItemAmount = () => {
    const amount = dialogAmountCount.value;

    if (isNaN(amount) || amount === null || amount <= 0) {
        dialogAmount.value = false;
        return;
    }

    const updatedItems = [...items.value];
    const scaledItem = scaleObjectByNewAmount(updatedItems[dialogAmountId.value], amount);
    updatedItems[dialogAmountId.value] = scaledItem;
    store.setItems(updatedItems);

    dialogAmount.value = false;
};

const scaleObjectByNewAmount = (obj, newAmount) => {
    if (newAmount <= 0) {
        throw new Error("Die neue Menge muss größer als 0 sein.");
    }

    const scaleFactor = newAmount / obj.amount;
    obj.amount = newAmount;
    obj.kcal = parseInt(Math.round(obj.kcal * scaleFactor));
    obj.protein = parseInt(Math.round(obj.protein * scaleFactor));
    obj.fat = parseInt(Math.round(obj.fat * scaleFactor));
    obj.carbohydrates = parseInt(Math.round(obj.carbohydrates * scaleFactor));

    return obj;
};
</script>

<style scoped>
.card-with-margin {
    margin-bottom: 3px;
}

.healthy-rating-low {
    background: linear-gradient(to right, #EF5350 8px, white 10px);
}

.healthy-rating-medium {
    background: linear-gradient(to right, #BDBDBD 8px, white 10px);
}

.healthy-rating-high {
    background: linear-gradient(to right, #66BB6A 8px, white 10px);
}
</style>