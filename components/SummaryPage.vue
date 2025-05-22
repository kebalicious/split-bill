<template>
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
          <div class="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2">
            <button v-for="(person, index) in people" :key="index" @click="openPersonModal(index)" :class="[
              'hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border rounded-lg text-center relative',
              person.paid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
            ]">
              <div class="mb-1 text-gray-500 text-sm">{{ person.name || `${$t('person')} ${index + 1}` }}</div>
              <div class="font-bold text-lg">{{ formatPrice(getPersonTotal(index)) }}</div>
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
</template>

<script setup lang="ts">
import { useState } from '#imports';

interface Person {
  items: string[];
  name: string;
  paid: boolean;
}

const items = useState<any[]>('items', () => []);
const serviceTaxInput = useState<number>('serviceTax', () => 0);
const deliveryFeeInput = useState<number>('deliveryFee', () => 0);
const numberOfPeople = useState<number>('numberOfPeople', () => 1);
const splitEqually = useState<boolean>('splitEqually', () => true);
const people = useState<Person[]>('people', () => [{ items: [], name: '', paid: false }]);

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2
  }).format(price);
};

const grandTotal = computed(() => {
  const itemsTotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return itemsTotal + (serviceTaxInput.value || 0) + (deliveryFeeInput.value || 0);
});

const getRoundedAmount = (amount: number): number => {
  return Math.ceil(amount / 0.05) * 0.05;
};

const getRoundingAmount = (amount: number): number => {
  return getRoundedAmount(amount) - amount;
};

const getPersonTotal = (index: number) => {
  const person = people.value[index];
  const itemsTotal = person.items.reduce((sum, itemName) => {
    const item = items.value.find(i => i.name === itemName);
    return sum + (item ? item.price * item.quantity : 0);
  }, 0);
  const serviceTaxShare = serviceTaxInput.value / numberOfPeople.value;
  const deliveryFeeShare = deliveryFeeInput.value / numberOfPeople.value;
  return getRoundedAmount(itemsTotal + serviceTaxShare + deliveryFeeShare);
};

const openPersonModal = (index: number) => {
  // This will be handled by the parent component
  emit('openPersonModal', index);
};

const emit = defineEmits(['openPersonModal']);
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