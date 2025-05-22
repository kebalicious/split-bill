<template>
  <div>
    <div class="bill-details">
      <h3 class="mb-2 font-bold text-lg">Bill Items:</h3>
      <div class="bg-white dark:bg-card-dark rounded-xl overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800">
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-left"><span class="inline-flex items-center gap-1">📝 Item</span></th>
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-left"><span class="inline-flex items-center gap-1">💸 Price</span></th>
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-left"><span class="inline-flex items-center gap-1">🔢 Qty</span></th>
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-left"><span class="inline-flex items-center gap-1">Σ Total</span></th>
              <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-center">➕</th>
            </tr>
          </thead>
          <tbody>
            <!-- Input row -->
            <tr>
              <td class="px-4 py-2 align-middle">
                <input type="text" v-model="newItem.name" placeholder="Item name" class="px-2 py-1 border rounded w-full" @keyup.enter="addItem" />
              </td>
              <td class="px-4 py-2 align-middle">
                <input type="number" v-model.number="newItem.price" placeholder="Price" min="0" step="0.01" class="px-2 py-1 border rounded w-full" @keyup.enter="addItem" />
              </td>
              <td class="px-4 py-2 align-middle">
                <input type="number" v-model.number="newItem.quantity" placeholder="Qty" min="1" step="1" class="px-2 py-1 border rounded w-full" @keyup.enter="addItem" />
              </td>
              <td class="px-4 py-2 text-gray-400 align-middle">-</td>
              <td class="px-4 py-2 text-center align-middle">
                <button @click="addItem" :disabled="!isValidItem" class="bg-primary-light dark:bg-primary-dark disabled:opacity-50 p-2 rounded-full text-white" title="Add">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </td>
            </tr>
            <!-- Data rows -->
            <tr v-if="items.length === 0">
              <td colspan="5" class="px-4 py-6 text-gray-400 dark:text-gray-500 text-center">No items yet</td>
            </tr>
            <tr v-for="(item, index) in items" :key="index" class="group hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 border-b last:border-b-0 transition-all">
              <td class="px-4 py-3 align-middle">{{ item.name }}</td>
              <td class="px-4 py-3 align-middle">{{ formatPrice(item.price) }}</td>
              <td class="px-4 py-3 align-middle">{{ item.quantity }}</td>
              <td class="px-4 py-3 align-middle">{{ formatPrice(item.price * item.quantity) }}</td>
              <td class="px-4 py-3 text-center align-middle">
                <button @click="removeItem(index)" class="hover:bg-red-100 dark:hover:bg-red-900 p-2 rounded-full transition-colors" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500 group-hover:text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <div class="flex items-center gap-4">
        <label class="w-32" for="serviceTax">Service Tax (RM):</label>
        <input type="number" id="serviceTax" v-model.number="serviceTaxInput" min="0" step="0.01" class="flex-1 px-2 py-1 border rounded" />
      </div>
      <div class="flex items-center gap-4">
        <label class="w-32" for="deliveryFee">Delivery Fee (RM):</label>
        <input type="number" id="deliveryFee" v-model.number="deliveryFeeInput" min="0" step="0.01" class="flex-1 px-2 py-1 border rounded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState, computed, watch } from '#imports';

interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

interface NewItem {
  name: string;
  price: number;
  quantity: number;
}

const items = useState<BillItem[]>('items', () => []);
const newItem = useState<NewItem>('newItem', () => ({ name: '', price: 0, quantity: 1 }));
const serviceTaxInput = useState<number>('serviceTax', () => 0);
const deliveryFeeInput = useState<number>('deliveryFee', () => 0);

const isValidItem = computed(() => {
  return newItem.value.name.trim() !== '' && newItem.value.price > 0 && newItem.value.quantity > 0;
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2
  }).format(price);
};

const addItem = () => {
  if (!isValidItem.value) return;
  items.value.push({
    name: newItem.value.name.trim(),
    price: newItem.value.price,
    quantity: newItem.value.quantity
  });
  newItem.value = { name: '', price: 0, quantity: 1 };
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const grandTotal = computed(() => {
  const itemsTotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return itemsTotal + (serviceTaxInput.value || 0) + (deliveryFeeInput.value || 0);
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

.bill-details {
  margin-top: 2rem;
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