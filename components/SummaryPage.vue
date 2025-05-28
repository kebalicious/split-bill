<template>
  <div v-if="mode === 'manual'">
    <div class="bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
      <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">{{ $t('summary') }}</h2>
      <div class="my-4 border-t border-dashed"></div>
      <div class="flex flex-col gap-4 text-sm">
        <div class="flex flex-col gap-2">
          <div class="mb-2 text-gray-500">{{ $t('eachPersonPays') }}</div>
          <div v-if="splitEqually">
            <div class="font-bold text-xl">{{ formatPrice(getRoundedAmount(grandTotal / numberOfPeople)) }}</div>
            <div class="mt-1 text-gray-400 text-sm">{{ $t('roundedBy') }}: {{ formatPrice(getRoundingAmount(grandTotal /
              numberOfPeople)) }}</div>
          </div>
          <div v-else>
            <div class="flex flex-col gap-4">
              <button v-for="(person, index) in people" :key="index" @click="openPersonModal(index)" :class="[
                'hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border rounded-lg text-center relative',
                person.paid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
              ]">
                <div class="mb-1 text-gray-500 text-sm">{{ person.name || `${$t('person')} ${index + 1}` }}</div>
                <div class="font-bold text-lg">{{ formatPrice(getPersonTotal(index, personItems)) }}</div>
                <div v-if="person.paid" class="top-2 right-2 absolute text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Person Items Modal -->
    <div v-if="showPersonModal"
      class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 overflow-y-auto text-sm">
      <div
        class="relative flex flex-col bg-white dark:bg-card-dark shadow-lg mx-2 p-6 rounded-xl w-full max-w-2xl max-h-[80vh]">
        <div class="flex justify-between items-center mb-6">
          <div class="flex flex-col">
            <h3 class="font-bold text-lg">Select Items</h3>
          </div>
          <button @click="closePersonModal" class="text-gray-400 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <input v-model="people[selectedPersonIndex].name" type="text"
          class="p-3 border rounded-lg focus:outline-blue-200 w-full text-gray-900" placeholder="Enter name" />
        <div class="my-4 border-t border-dashed"></div>

        <div class="flex flex-col gap-4 overflow-y-auto">
          <div v-for="item in items" :key="item.name" :class="[
            'flex items-center gap-4 p-3 border rounded-lg',
            isItemFullySelected(item.name, selectedPersonIndex) ? 'bg-gray-200 dark:bg-gray-700' : ''
          ]">
            <input type="checkbox" :id="`person-${selectedPersonIndex}-${item.name}`"
              v-model="personItems[selectedPersonIndex][item.name].selected"
              :disabled="isItemFullySelected(item.name, selectedPersonIndex)" class="w-4 h-4">

            <label :for="`person-${selectedPersonIndex}-${item.name}`" class="flex-1">
              {{ item.name }}
            </label>

            <select v-if="item.quantity > 1" v-model="personItems[selectedPersonIndex][item.name].quantity"
              class="p-2 border rounded w-20 text-gray-900 text-center" :disabled="!personItems[selectedPersonIndex][item.name].selected">
              <option v-for="qty in getAvailableQuantity(item.name, selectedPersonIndex)" :key="qty" :value="qty">{{ qty
                }}</option>
            </select>

            <div class="w-24 text-right">
              {{ formatPrice(item.price * (personItems[selectedPersonIndex][item.name].quantity || 1)) }}
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Subtotal:</span>
            <span class="font-bold">{{ formatPrice(getPersonSubtotal(selectedPersonIndex, personItems)) }}</span>
          </div>
          <div v-if="serviceTaxIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Service Tax ({{ numberOfPeople }} people):</span>
            <span>{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems) -
              getPersonSubtotal(selectedPersonIndex, personItems) - (deliveryFeeIncluded ? deliveryFeeInput
                / numberOfPeople : 0)) }}</span>
          </div>
          <div v-if="deliveryFeeIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Delivery Fee ({{ numberOfPeople }} people):</span>
            <span>{{ formatPrice(deliveryFeeInput / numberOfPeople) }}</span>
          </div>
          <div class="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems)) }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-6">
          <button @click="savePersonItems"
            class="flex justify-center items-center gap-2 bg-primary-light dark:bg-primary-dark p-3 rounded-xl w-full font-bold text-white text-sm">
            Save
          </button>
          <button @click="markAsPaid(selectedPersonIndex)" :class="[
            'flex justify-center items-center gap-2 p-3 rounded-xl w-full font-bold text-sm',
            people[selectedPersonIndex].paid
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          ]">
            {{ people[selectedPersonIndex].paid ? 'Paid' : 'Mark as Paid' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useBillCalculations } from '~/composables/useBillCalculations';

const props = defineProps<{
  mode: 'upload' | 'manual'
}>();

const {
  items,
  serviceTaxInput,
  deliveryFeeInput,
  numberOfPeople,
  splitEqually,
  people,
  serviceTaxType,
  serviceTaxIncluded,
  deliveryFeeIncluded,
  selectedCurrency,
  formatPrice,
  grandTotal,
  getRoundedAmount,
  getRoundingAmount,
  getPersonSubtotal,
  getPersonTotal,
  currencies
} = useBillCalculations();

// Person items modal
const showPersonModal = ref(false);
const selectedPersonIndex = ref(0);
const personItems = ref<Record<number, Record<string, { selected: boolean; quantity: number }>>>({});

// Initialize personItems
watch(numberOfPeople, (newValue) => {
  for (let i = 0; i < newValue; i++) {
    if (!personItems.value[i]) {
      personItems.value[i] = {};
      items.value.forEach(item => {
        personItems.value[i][item.name] = { selected: people.value[i]?.items.includes(item.name) || false, quantity: 1 };
      });
    }
  }
  Object.keys(personItems.value).forEach(key => {
    if (parseInt(key) >= newValue) {
      delete personItems.value[parseInt(key)];
    }
  });
});

watch(items, (newItems) => {
  Object.keys(personItems.value).forEach(personIndex => {
    newItems.forEach(item => {
      if (!personItems.value[parseInt(personIndex)][item.name]) {
        personItems.value[parseInt(personIndex)][item.name] = { selected: people.value[parseInt(personIndex)]?.items.includes(item.name) || false, quantity: 1 };
      }
    });
    Object.keys(personItems.value[parseInt(personIndex)]).forEach(itemName => {
      if (!newItems.find(item => item.name === itemName)) {
        delete personItems.value[parseInt(personIndex)][itemName];
      }
    });
  });
}, { deep: true });

const openPersonModal = (index: number) => {
  selectedPersonIndex.value = index;
  if (!personItems.value[index]) {
    personItems.value[index] = {};
    items.value.forEach(item => {
      personItems.value[index][item.name] = { selected: people.value[index].items.includes(item.name), quantity: 1 };
    });
  }
  showPersonModal.value = true;
};

const closePersonModal = () => {
  showPersonModal.value = false;
};

const savePersonItems = () => {
  const selectedItems = Object.entries(personItems.value[selectedPersonIndex.value])
    .filter(([_, selection]) => selection.selected)
    .map(([itemName]) => itemName);
  people.value[selectedPersonIndex.value].items = selectedItems;
  closePersonModal();
};

const isItemFullySelected = (itemName: string, currentPersonIndex: number): boolean => {
  const item = items.value.find(i => i.name === itemName);
  if (!item) return false;
  const totalSelected = Object.entries(personItems.value).reduce((sum, [personIndex, items]) => {
    const index = parseInt(personIndex);
    if (index === currentPersonIndex) return sum;
    return sum + (items[itemName]?.selected ? (items[itemName]?.quantity || 0) : 0);
  }, 0);
  return totalSelected >= item.quantity;
};

const getAvailableQuantity = (itemName: string, currentPersonIndex: number): number[] => {
  const item = items.value.find(i => i.name === itemName);
  if (!item) return [];
  const totalSelected = Object.entries(personItems.value).reduce((sum, [personIndex, items]) => {
    const index = parseInt(personIndex);
    if (index === currentPersonIndex) return sum;
    return sum + (items[itemName]?.selected ? (items[itemName]?.quantity || 0) : 0);
  }, 0);
  const available = item.quantity - totalSelected;
  return Array.from({ length: available }, (_, i) => i + 1);
};

const markAsPaid = (index: number) => {
  people.value[index].paid = !people.value[index].paid;
};
</script>

<style scoped>
.summary-page {
  padding: 20px;
}

.user-bills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>