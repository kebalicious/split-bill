<template>
  <div>
    <div class="space-y-4">
      <div class="bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">{{ $t('addBillDetails') }}</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex mb-0 pt-4 pb-4 border-b font-semibold text-gray-900 dark:text-white text-sm">
          <div class="w-12 sm:w-16">{{ $t('quantity') }}</div>
          <div class="flex-1">{{ $t('items') }}</div>
          <div class="w-20 sm:w-24 text-right">{{ $t('price') }}</div>
        </div>
        <div v-for="(item, index) in items" :key="index"
          class="flex items-center py-4 border-b last:border-b-0 text-gray-900 dark:text-white text-sm">
          <div class="w-12 sm:w-16">{{ item.quantity }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="w-20 sm:w-24 text-right">{{ formatPrice(item.price * item.quantity) }}</div>
        </div>
        <div v-if="items.length === 0" class="flex justify-center items-center pt-8 pb-0 text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('noItemAdded') }}
        </div>
        <!-- Add Item Row -->
        <div
          class="flex justify-center items-center gap-2 bg-primary-light hover:bg-primary-light/90 active:bg-primary-light/90 dark:hover:bg-primary-dark/90 dark:active:bg-primary-dark/90 dark:bg-primary-dark my-8 p-3 border border-primary-light dark:border-primary-dark rounded-xl font-medium text-card-light dark:text-card-dark text-sm transition cursor-pointer"
          @click="openAddModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
          </svg>
          <span class="font-medium">{{ $t('addItem') }}</span>
        </div>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-1 text-sm">
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">{{ $t('subtotal') }}</span><span class="text-gray-900 dark:text-white">{{
            formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}}</span></div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex flex-col sm:flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center"><span class="text-gray-500 dark:text-gray-400">{{ $t('serviceTaxIncluded')
                }}</span>
                  <label class="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="serviceTaxIncluded">
                    <div
                      class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                    </div>
                  </label>
                </div>
                <div v-if="serviceTaxIncluded"
                  class="flex justify-between items-center bg-white dark:bg-white p-3 border rounded-lg">
                  <label for="serviceTax" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{ $t('serviceTax') }}</label>
                  <div class="relative w-1/2">
                    <div class="top-1/2 left-0 absolute flex items-center gap-1 pl-2 -translate-y-1/2">
                      <button @click="serviceTaxType = 'amount'" :class="[
                        'px-2 py-1 text-xs rounded w-12',
                        serviceTaxType === 'amount'
                          ? 'bg-primary-light dark:bg-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      ]">
                        RM
                      </button>
                      <button @click="serviceTaxType = 'percentage'" :class="[
                        'px-2 py-1 text-xs rounded w-12',
                        serviceTaxType === 'percentage'
                          ? 'bg-primary-light dark:bg-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      ]">
                        %
                      </button>
                    </div>
                    <input id="serviceTax" v-model.number="serviceTaxInput" type="number" min="0"
                      :max="serviceTaxType === 'percentage' ? '100' : '999.99'" step="0.01"
                      class="bg-white dark:bg-white pl-28 outline-none w-full text-gray-900 text-end"
                      :placeholder="serviceTaxType === 'percentage' ? '0%' : '0.00'"
                      @focus="(e) => (e.target as HTMLInputElement).value = ''" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-[200px]">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center"><span class="text-gray-500 dark:text-gray-400">{{ $t('deliveryFeeIncluded')
                }}</span>
                  <label class="inline-flex relative items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" v-model="deliveryFeeIncluded">
                    <div
                      class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                    </div>
                  </label>
                </div>
                <div v-if="deliveryFeeIncluded"
                  class="flex justify-between items-center bg-white dark:bg-white p-3 border rounded-lg">
                  <label for="deliveryFee" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{ $t('deliveryFee')
                  }}</label>
                  <input id="deliveryFee" v-model.number="deliveryFeeInput" type="number" min="0" max="999.99"
                    step="0.01" class="bg-white dark:bg-white outline-none w-1/2 text-gray-900 text-end" placeholder="0.00"
                    @focus="(e) => (e.target as HTMLInputElement).value = ''" />
                </div>
              </div>
            </div>
          </div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex justify-between font-bold text-base"><span class="text-gray-900 dark:text-white">{{ $t('grandTotal') }}</span><span class="text-gray-900 dark:text-white">{{
            formatPrice(grandTotal) }}</span></div>
        </div>
      </div>

      <div class="bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">{{ $t('splitBillTitle') }}</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">{{ $t('numberOfPeople') }}</span>
              <div class="flex items-center gap-2">
                <button @click="decrementPeople" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="w-12 font-medium text-center">{{ numberOfPeople }}</span>
                <button @click="incrementPeople" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="text-gray-500">{{ $t('splitEqually') }}</span>
                <div class="group relative">
                  <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div
                    class="bottom-full left-1/2 absolute bg-gray-900 opacity-0 group-hover:opacity-100 mb-2 p-2 rounded-lg w-64 text-white text-xs leading-6 transition-opacity -translate-x-1/2 duration-200 pointer-events-none transform">
                    {{ $t('splitEquallyTooltip') }}
                  </div>
                </div>
              </div>
              <label class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" v-model="splitEqually">
                <div
                  class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="sm:hidden block bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">{{ $t('summary') }}</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="mb-2 text-gray-500 dark:text-gray-400">{{ $t('eachPersonPays') }}</div>
            <div v-if="splitEqually">
              <div class="font-bold text-gray-900 dark:text-white text-xl">{{ formatPrice(getRoundedAmount(grandTotal / numberOfPeople)) }}</div>
              <div class="mt-1 text-gray-400 dark:text-gray-500 text-sm">{{ $t('roundedBy') }}: {{ formatPrice(getRoundingAmount(grandTotal /
                numberOfPeople)) }}</div>
            </div>
            <div v-else>
              <div class="flex flex-col gap-4">
                <button v-for="(person, index) in people" :key="index" @click="openPersonModal(index)" :class="[
                  'hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border rounded-lg text-center relative',
                  person.paid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                ]">
                  <div class="mb-1 text-gray-500 dark:text-gray-400 text-sm">{{ person.name || `${$t('person')} ${index + 1}` }}</div>
                  <div class="font-bold text-gray-900 dark:text-white text-lg">{{ formatPrice(getPersonTotal(index, personItems)) }}</div>
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
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 text-sm">
      <div class="relative bg-white dark:bg-card-dark shadow-lg mx-2 p-6 rounded-xl w-full max-w-md">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-lg">{{ $t('addItem') }}</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <input v-model="modalItem.name" type="text" class="bg-white dark:bg-white p-3 border rounded-lg focus:outline-blue-200 w-full text-gray-900"
              :placeholder="$t('itemName')" />
          </div>
          <div
            class="flex justify-between items-center bg-white dark:bg-white p-3 border rounded-lg">
            <label for="modalPrice" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{ $t('price') }}</label>
            <input id="modalPrice" v-model="modalItem.price" type="number" class="bg-white dark:bg-white outline-none w-1/2 text-gray-900 text-end"
              placeholder="0.00" />
          </div>
          <div
            class="flex justify-between items-center bg-white dark:bg-white p-3 border rounded-lg">
            <label for="modalQuantity" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{ $t('quantity') }}</label>
            <input id="modalQuantity" v-model.number="modalItem.quantity" type="number" min="1" step="1"
              class="bg-white dark:bg-white outline-none w-1/2 text-gray-900 text-end" placeholder="1" />
          </div>
        </div>
        <button @click="saveModalItem" :disabled="!(isValidModalItem)"
          class="flex justify-center items-center gap-2 bg-primary-light dark:bg-primary-dark disabled:opacity-50 mt-6 p-3 rounded-xl w-full font-bold text-white text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
          </svg>
          <span class="font-medium">{{ $t('save') }}</span>
        </button>
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
          class="bg-white dark:bg-white p-3 border rounded-lg focus:outline-blue-200 w-full text-gray-900" placeholder="Enter name" />
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
              class="p-2 border rounded w-20" :disabled="!personItems[selectedPersonIndex][item.name].selected">
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
            <span class="text-gray-500 dark:text-gray-400">Subtotal:</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ formatPrice(getPersonSubtotal(selectedPersonIndex, personItems)) }}</span>
          </div>
          <div v-if="serviceTaxIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500 dark:text-gray-400">Service Tax ({{ numberOfPeople }} people):</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems) -
              getPersonSubtotal(selectedPersonIndex, personItems) - (deliveryFeeIncluded.value ? deliveryFeeInput.value
                / numberOfPeople.value : 0)) }}</span>
          </div>
          <div v-if="deliveryFeeIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500 dark:text-gray-400">Delivery Fee ({{ numberOfPeople }} people):</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(deliveryFeeInput / numberOfPeople) }}</span>
          </div>
          <div class="flex justify-between items-center font-bold text-lg">
            <span class="text-gray-900 dark:text-white">Total:</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems)) }}</span>
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

interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

interface NewItem {
  name: string;
  price: string;
  quantity: number;
}

interface Person {
  items: string[];
  name: string;
  paid: boolean;
}

// Use composable for shared calculations
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
  formatPrice,
  grandTotal,
  getRoundedAmount,
  getRoundingAmount,
  getPersonSubtotal,
  getPersonTotal
} = useBillCalculations();

// Modal state for add item
const showAddModal = ref(false);
const modalItem = ref({ name: '', price: '', quantity: 1 });

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

// Add item modal logic
const newItem = ref<NewItem>({ name: '', price: '', quantity: 1 });

const isValidItem = computed(() => {
  return newItem.value.name.trim() !== '' && parseFloat(newItem.value.price) > 0 && newItem.value.quantity > 0;
});

const isValidModalItem = computed(() => {
  return modalItem.value.name.trim() !== '' && parseFloat(modalItem.value.price) > 0 && modalItem.value.quantity > 0;
});

const addItem = () => {
  if (!isValidItem.value) return;
  items.value.push({
    name: newItem.value.name.trim(),
    price: parseFloat(newItem.value.price),
    quantity: newItem.value.quantity
  });
  newItem.value = { name: '', price: '', quantity: 1 };
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const openAddModal = () => {
  modalItem.value = { name: '', price: '', quantity: 1 };
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const saveModalItem = () => {
  if (isValidModalItem.value) {
    items.value.push({
      name: modalItem.value.name.trim(),
      price: parseFloat(modalItem.value.price),
      quantity: modalItem.value.quantity
    });
    closeAddModal();
  }
};

const incrementPeople = () => {
  numberOfPeople.value++;
  people.value.push({ items: [], name: '', paid: false });
};

const decrementPeople = () => {
  if (numberOfPeople.value > 1) {
    numberOfPeople.value--;
    people.value.pop();
  }
};

watch(serviceTaxInput, (val) => {
  if (typeof val === 'number') {
    serviceTaxInput.value = Number(val.toFixed(2));
  }
});

watch(serviceTaxIncluded, (val) => {
  if (!val) {
    serviceTaxInput.value = 0;
  }
});

watch(deliveryFeeIncluded, (val) => {
  if (!val) {
    deliveryFeeInput.value = 0;
  }
});
</script>

<style scoped>
.entry-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.add-button {
  background: var(--primary-color);
  color: var(--card-bg);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.add-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-button {
  background: var(--error-color);
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s ease;
}

.delete-button:hover {
  opacity: 0.9;
}

.bill-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.grand-total {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--text-color);
}
</style>