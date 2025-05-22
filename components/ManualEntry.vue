<template>
  <div>
    <div class="space-y-4">
      <div class="bg-white shadow p-4 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">Add your bill details</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex mb-0 pt-4 pb-4 border-b font-semibold text-gray-900 text-sm">
          <div class="w-12">Qty.</div>
          <div class="flex-1">Item(s)</div>
          <div class="w-20 text-right">Price</div>
        </div>
        <div v-for="(item, index) in items" :key="index"
          class="flex items-center py-4 border-b last:border-b-0 text-gray-900 text-sm">
          <div class="w-12">{{ item.quantity }}</div>
          <div class="flex-1">{{ item.name }}</div>
          <div class="w-20 text-right">{{ formatPrice(item.price * item.quantity) }}</div>
        </div>
        <div v-if="items.length === 0" class="flex justify-center items-center pt-8 pb-0 text-gray-500 text-sm">
          No item added
        </div>
        <!-- Add Item Row (Mobile, styled like screenshot) -->
        <div
          class="flex justify-center items-center gap-2 bg-primary-light active:bg-primary-light/90 dark:active:bg-primary-dark/90 dark:bg-primary-dark my-8 p-3 border border-primary-light dark:border-primary-dark rounded-xl font-medium text-card-light dark:text-card-dark text-sm transition cursor-pointer"
          @click="openAddModal">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
          </svg>
          <span class="font-medium">Add Item</span>
        </div>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-1 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span>{{
            formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}}</span></div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center"><span class="text-gray-500">Is service tax
                  included?</span>
                <label class="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="serviceTaxIncluded">
                  <div
                    class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                  </div>
                </label>
              </div>
              <div v-if="serviceTaxIncluded"
                class="flex justify-between items-center p-3 border rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
                <label for="serviceTax" class="block w-1/2 font-medium cursor-pointer">Service Tax</label>
                <input id="serviceTax" v-model.number="serviceTaxInput" type="number" min="0" max="999.99" step="0.01"
                  class="outline-none w-1/2 text-end" placeholder="0.00"
                  @focus="(e) => (e.target as HTMLInputElement).value = ''" />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center"><span class="text-gray-500">Is delivery fee
                  included?</span>
                <label class="inline-flex relative items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="deliveryFeeIncluded">
                  <div
                    class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                  </div>
                </label>
              </div>
              <div v-if="deliveryFeeIncluded"
                class="flex justify-between items-center p-3 border rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
                <label for="deliveryFee" class="block w-1/2 font-medium cursor-pointer">Delivery Fee</label>
                <input id="deliveryFee" v-model.number="deliveryFeeInput" type="number" min="0" max="999.99" step="0.01"
                  class="outline-none w-1/2 text-end" placeholder="0.00"
                  @focus="(e) => (e.target as HTMLInputElement).value = ''" />
              </div>
            </div>
          </div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex justify-between font-bold text-base"><span>Grand Total</span><span>{{
            formatPrice(grandTotal) }}</span></div>
        </div>
      </div>

      <div class="bg-white shadow p-4 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">Choose how you would like to split the
          bill</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">No. of people</span>
              <div class="flex items-center gap-2">
                <button @click="decrementPeople" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="font-medium">{{ numberOfPeople }}</span>
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
              <span class="text-gray-500">Split bill equally?</span>
              <label class="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" v-model="splitEqually">
                <div
                  class="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white dark:bg-gray-700 dark:peer-checked:bg-primary-dark peer-checked:bg-primary-light after:border after:border-gray-300 dark:border-gray-600 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none dark:peer-focus:ring-blue-800 peer-focus:ring-4 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full">
                </div>
              </label>
            </div>
          </div>
          <div class="my-4 border-t border-dashed"></div>
          <div>
            <div v-if="!splitEqually" class="flex flex-col gap-4">
              <div class="gap-3 grid grid-cols-2 sm:grid-cols-3">
                <button v-for="(person, index) in people" :key="index" @click="openNameModal(index)"
                  class="flex justify-center items-center hover:bg-gray-50 dark:hover:bg-gray-800 p-3 border rounded-lg">
                  <span class="text-sm">{{ person.name || `Person ${index + 1}` }}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="bg-white shadow p-4 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">Summary</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">

            <div v-if="splitEqually">
              <div class="mb-2 text-gray-500">Each person pays:</div>
              <div class="font-bold text-xl">{{ formatPrice(getRoundedAmount(grandTotal / numberOfPeople)) }}</div>
              <div class="mt-1 text-gray-500 text-sm">Rounded by: {{ formatPrice(getRoundingAmount(grandTotal /
                numberOfPeople)) }}</div>
            </div>

            <div v-else class="mt-4">
              <div class="mb-2 text-gray-500">Select items for each person:</div>
              <div class="gap-4 grid grid-cols-2 sm:grid-cols-4">
                <button v-for="(_, index) in Array(numberOfPeople)" :key="index" @click="openPersonModal(index)"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border rounded-lg text-center">
                  <div class="mb-1 font-bold text-lg">[{{ index + 1 }}]</div>
                  <div class="text-gray-500 text-sm">{{ formatPrice(getPersonTotal(index)) }}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddModal" class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 text-sm">
      <div class="relative bg-white dark:bg-card-dark shadow-lg mx-2 p-6 rounded-xl w-full max-w-sm">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-lg">Add Item</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <input v-model="modalItem.name" type="text" class="p-3 border rounded-lg focus:outline-blue-200 w-full"
              placeholder="Item name" />
          </div>
          <div
            class="flex justify-between items-center p-3 border rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
            <label for="modalPrice" class="block w-1/2 font-medium cursor-pointer">Price</label>
            <input id="modalPrice" v-model="modalItem.price" type="number" class="outline-none w-1/2 text-end"
              placeholder="0.00" />
          </div>
          <div
            class="flex justify-between items-center p-3 border rounded-lg focus-within:outline focus-within:outline-2 focus-within:outline-blue-400">
            <label for="modalQuantity" class="block w-1/2 font-medium cursor-pointer">Quantity</label>
            <input id="modalQuantity" v-model.number="modalItem.quantity" type="number" min="1" step="1"
              class="outline-none w-1/2 text-end" placeholder="1" />
          </div>
        </div>
        <button @click="saveModalItem" :disabled="!(isValidModalItem)"
          class="flex justify-center items-center gap-2 bg-primary-light dark:bg-primary-dark disabled:opacity-50 mt-6 p-3 rounded-xl w-full font-bold text-white text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
          </svg>
          <span class="font-medium">Save</span>
        </button>
      </div>
    </div>

    <!-- Person Items Modal -->
    <div v-if="showPersonModal"
      class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 text-sm">
      <div class="relative bg-white dark:bg-card-dark shadow-lg mx-2 p-6 rounded-xl w-full max-w-lg">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-lg">Person {{ selectedPersonIndex + 1 }} Items</h3>
          <button @click="closePersonModal" class="text-gray-400 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div v-for="item in items" :key="item.name" class="flex items-center gap-4 p-3 border rounded-lg">
            <input type="checkbox" :id="`person-${selectedPersonIndex}-${item.name}`"
              v-model="personItems[selectedPersonIndex][item.name].selected" class="w-4 h-4">

            <label :for="`person-${selectedPersonIndex}-${item.name}`" class="flex-1">
              {{ item.name }}
            </label>

            <select v-if="item.quantity > 1" v-model="personItems[selectedPersonIndex][item.name].quantity"
              class="p-2 border rounded w-20" :disabled="!personItems[selectedPersonIndex][item.name].selected">
              <option v-for="qty in item.quantity" :key="qty" :value="qty">{{ qty }}</option>
            </select>

            <div class="w-24 text-right">
              {{ formatPrice(item.price * (personItems[selectedPersonIndex][item.name].quantity || 1)) }}
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Subtotal:</span>
            <span class="font-bold">{{ formatPrice(getPersonSubtotal(selectedPersonIndex)) }}</span>
          </div>
          <div v-if="serviceTaxIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Service Tax ({{ numberOfPeople }} people):</span>
            <span>{{ formatPrice(serviceTaxInput / numberOfPeople) }}</span>
          </div>
          <div v-if="deliveryFeeIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500">Delivery Fee ({{ numberOfPeople }} people):</span>
            <span>{{ formatPrice(deliveryFeeInput / numberOfPeople) }}</span>
          </div>
          <div class="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>{{ formatPrice(getPersonTotal(selectedPersonIndex)) }}</span>
          </div>
        </div>

        <button @click="savePersonItems"
          class="flex justify-center items-center gap-2 bg-primary-light dark:bg-primary-dark mt-6 p-3 rounded-xl w-full font-bold text-white text-sm">
          Save
        </button>
      </div>
    </div>

    <!-- Person Name Modal -->
    <div v-if="showNameModal"
      class="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 text-sm">
      <div class="relative bg-white dark:bg-card-dark shadow-lg mx-2 p-6 rounded-xl w-full max-w-sm">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-lg">Enter Name</h3>
          <button @click="closeNameModal" class="text-gray-400 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <input v-model="nameInput" type="text" class="p-3 border rounded-lg focus:outline-blue-200 w-full"
              placeholder="Enter name" />
          </div>
        </div>
        <button @click="saveName"
          class="flex justify-center items-center gap-2 bg-primary-light dark:bg-primary-dark mt-6 p-3 rounded-xl w-full font-bold text-white text-sm">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useState, computed, watch } from '#imports';

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
}

const items = useState<BillItem[]>('items', () => []);
const newItem = useState<NewItem>('newItem', () => ({ name: '', price: '', quantity: 1 }));
const serviceTaxInput = useState<number>('serviceTax', () => 0);
const deliveryFeeInput = useState<number>('deliveryFee', () => 0);
const serviceTaxIncluded = ref(false);
const deliveryFeeIncluded = ref(false);

// People counter and bill splitting
const numberOfPeople = ref(1);
const splitEqually = ref(true);
const people = ref<Person[]>([{ items: [], name: '' }]);

// Modal state for add item
const showAddModal = ref(false);
const modalItem = ref({ name: '', price: '', quantity: 1 });

const isValidItem = computed(() => {
  return newItem.value.name.trim() !== '' && parseFloat(newItem.value.price) > 0 && newItem.value.quantity > 0;
});

const isValidModalItem = computed(() => {
  return modalItem.value.name.trim() !== '' && parseFloat(modalItem.value.price) > 0 && modalItem.value.quantity > 0;
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2
  }).format(price);
};

const addItem = () => {
  if (!(newItem.value.name.trim() !== '' && parseFloat(newItem.value.price) > 0 && newItem.value.quantity > 0)) return;
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

const grandTotal = computed(() => {
  const itemsTotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return itemsTotal + (serviceTaxInput.value || 0) + (deliveryFeeInput.value || 0);
});

const openAddModal = () => {
  modalItem.value = { name: '', price: '', quantity: 1 };
  showAddModal.value = true;
};
const closeAddModal = () => {
  showAddModal.value = false;
};
const saveModalItem = () => {
  if (modalItem.value.name.trim() && parseFloat(modalItem.value.price) > 0 && modalItem.value.quantity > 0) {
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
  people.value.push({ items: [], name: '' });
};

const decrementPeople = () => {
  if (numberOfPeople.value > 1) {
    numberOfPeople.value--;
    people.value.pop();
  }
};

const removePerson = (index: number) => {
  if (numberOfPeople.value > 1) {
    numberOfPeople.value--;
    people.value.splice(index, 1);
  }
};

const isPersonComplete = (index: number) => {
  const person = people.value[index];
  return person.items.length > 0;
};

watch(serviceTaxInput, (val, oldVal) => {
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

// Person items modal
const showPersonModal = ref(false);
const selectedPersonIndex = ref(0);
const personItems = ref<Record<number, Record<string, { selected: boolean; quantity: number }>>>({});

// Initialize personItems when numberOfPeople changes
watch(numberOfPeople, (newValue) => {
  // Initialize personItems for new people
  for (let i = 0; i < newValue; i++) {
    if (!personItems.value[i]) {
      personItems.value[i] = {};
      items.value.forEach(item => {
        personItems.value[i][item.name] = { selected: false, quantity: 1 };
      });
    }
  }
  // Remove personItems for removed people
  Object.keys(personItems.value).forEach(key => {
    if (parseInt(key) >= newValue) {
      delete personItems.value[parseInt(key)];
    }
  });
});

// Initialize personItems when items change
watch(items, (newItems) => {
  Object.keys(personItems.value).forEach(personIndex => {
    newItems.forEach(item => {
      if (!personItems.value[parseInt(personIndex)][item.name]) {
        personItems.value[parseInt(personIndex)][item.name] = { selected: false, quantity: 1 };
      }
    });
    // Remove items that no longer exist
    Object.keys(personItems.value[parseInt(personIndex)]).forEach(itemName => {
      if (!newItems.find(item => item.name === itemName)) {
        delete personItems.value[parseInt(personIndex)][itemName];
      }
    });
  });
}, { deep: true });

const openPersonModal = (index: number) => {
  selectedPersonIndex.value = index;
  showPersonModal.value = true;
};

const closePersonModal = () => {
  showPersonModal.value = false;
};

const getPersonSubtotal = (index: number) => {
  const personItemSelections = personItems.value[index] || {};
  return Object.entries(personItemSelections).reduce((sum, [itemName, selection]) => {
    if (selection.selected) {
      const item = items.value.find(i => i.name === itemName);
      if (item) {
        return sum + (item.price * selection.quantity);
      }
    }
    return sum;
  }, 0);
};

const getRoundedAmount = (amount: number): number => {
  return Math.ceil(amount / 0.05) * 0.05;
};

const getRoundingAmount = (amount: number): number => {
  return getRoundedAmount(amount) - amount;
};

const getPersonTotal = (index: number) => {
  const subtotal = getPersonSubtotal(index);
  const serviceTaxShare = serviceTaxIncluded.value ? serviceTaxInput.value / numberOfPeople.value : 0;
  const deliveryFeeShare = deliveryFeeIncluded.value ? deliveryFeeInput.value / numberOfPeople.value : 0;
  return getRoundedAmount(subtotal + serviceTaxShare + deliveryFeeShare);
};

const savePersonItems = () => {
  // Update the person's items in the people array
  const selectedItems = Object.entries(personItems.value[selectedPersonIndex.value])
    .filter(([_, selection]) => selection.selected)
    .map(([itemName]) => itemName);

  people.value[selectedPersonIndex.value].items = selectedItems;
  closePersonModal();
};

// Name modal state
const showNameModal = ref(false);
const nameInput = ref('');
const selectedNameIndex = ref(0);

const openNameModal = (index: number) => {
  selectedNameIndex.value = index;
  nameInput.value = people.value[index].name;
  showNameModal.value = true;
};

const closeNameModal = () => {
  showNameModal.value = false;
};

const saveName = () => {
  if (nameInput.value.trim()) {
    people.value[selectedNameIndex.value].name = nameInput.value.trim();
    closeNameModal();
  }
};
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