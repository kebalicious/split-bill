<template>
  <div>
    <div class="bg-yellow-50 dark:bg-yellow-900/20 mb-6 p-4 border border-yellow-200 dark:border-yellow-800 rounded-xl">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-yellow-700 dark:text-yellow-300 text-sm">{{ $t('featureUnavailable') }}</p>
      </div>
    </div>

    <div class="hidden">
      <div
        class="relative flex flex-col justify-center items-center bg-card-light hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 dark:bg-card-dark mb-6 border-2 border-primary-light dark:border-primary-dark border-dashed rounded-xl outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark min-h-[260px] transition-colors duration-200 cursor-pointer"
        @click="triggerFileInput" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop"
        :class="{ 'ring-2 ring-primary-light dark:ring-primary-dark': isDragging }" tabindex="0">
        <input ref="fileInput" type="file" class="hidden" @change="handleFileUpload" accept="image/*,application/pdf"
          :disabled="isLoading" />
        <div class="flex flex-col justify-center items-center pointer-events-none select-none">
          <svg class="mb-2 w-12 h-12 text-primary-light dark:text-primary-dark" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <span class="font-medium text-text-light dark:text-text-dark text-sm">{{ $t('clickOrDrag') }}</span>
          <span class="mt-1 text-text-light/60 dark:text-text-dark/60 text-xs">{{ $t('fileTypes') }}</span>
        </div>
        <div v-if="isLoading"
          class="z-10 absolute inset-0 flex justify-center items-center bg-card-light/80 dark:bg-card-dark/80 rounded-xl">
          <span class="font-semibold text-primary-light dark:text-primary-dark animate-pulse">{{ $t('analyzingImage') }}</span>
        </div>
      </div>
      <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
      <div v-if="items.length > 0" class="bill-details">
        <h3 class="mb-2 font-bold text-sm">{{ $t('extractedItems') }}</h3>
        <table class="mb-2 w-full text-sm">
          <thead>
            <tr>
              <th class="py-1 text-left">{{ $t('items') }}</th>
              <th class="py-1 text-left">{{ $t('price') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="py-1">{{ item.name }}</td>
              <td class="py-1">{{ formatPrice(item.price) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-2 pt-2 border-gray-200 dark:border-gray-700 border-t bill-summary">
          <p>{{ $t('serviceTax') }}: {{ formatPrice(serviceTax) }}</p>
          <p class="font-bold text-sm">{{ $t('grandTotal') }}: {{ formatPrice(grandTotal) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tesseract from 'tesseract.js';
import { useState } from '#imports';

interface BillItem {
  name: string;
  price: number;
}

const items = useState<BillItem[]>('items', () => []);
const serviceTax = useState<number>('serviceTax', () => 0);
const grandTotal = useState<number>('grandTotal', () => 0);
const isLoading = useState<boolean>('isLoading', () => false);
const error = useState<string>('error', () => '');

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const emit = defineEmits(['change-mode']);

const triggerFileInput = () => {
  if (!isLoading.value) fileInput.value?.click();
};

const onDragOver = () => {
  isDragging.value = true;
};
const onDragLeave = () => {
  isDragging.value = false;
};
const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processFile(file);
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) processFile(file);
};

const processFile = async (file: File) => {
  try {
    isLoading.value = true;
    error.value = '';
    items.value = [];
    serviceTax.value = 0;
    grandTotal.value = 0;
    const result = await Tesseract.recognize(file, 'eng');
    const text = result.data.text;
    await parseBill(text);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error processing image';
    console.error('Error processing image:', err);
  } finally {
    isLoading.value = false;
  }
};

const parseBill = async (text: string): Promise<void> => {
  // Simple parsing logic (replace with actual parsing logic)
  const lines = text.split('\n');
  const parsedItems = lines
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
      const parts = line.split(' ');
      const price = parseFloat(parts[parts.length - 1]) || 0;
      const name = parts.slice(0, -1).join(' ').trim();
      return {
        name,
        price
      };
    })
    .filter(item => item.name && item.price > 0); // Filter out invalid items

  if (parsedItems.length === 0) {
    throw new Error('No valid items found in the bill');
  }

  items.value = parsedItems;
  serviceTax.value = calculateServiceTax(parsedItems);
  grandTotal.value = calculateGrandTotal(parsedItems, serviceTax.value);
};

const calculateServiceTax = (items: BillItem[]): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return Math.round(subtotal * 0.1 * 100) / 100; // 10% service tax
};

const calculateGrandTotal = (items: BillItem[], tax: number): number => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal + tax;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2
  }).format(price);
};
</script>

<style scoped>
.upload-section {
  margin-bottom: 2rem;
}

.error-message {
  color: var(--error-color);
  margin-top: 0.5rem;
}

.loading {
  color: var(--text-color);
  margin-top: 0.5rem;
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
}
</style>