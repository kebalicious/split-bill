// composables/useBillCalculations.ts
import { computed } from 'vue';
import { useState } from '#imports';

interface BillItem {
  name: string;
  price: number;
  quantity: number;
}

interface Person {
  items: string[];
  name: string;
  paid: boolean;
}

export function useBillCalculations() {
  // Shared state
  const items = useState<BillItem[]>('items', () => []);
  const serviceTaxInput = useState<number>('serviceTax', () => 0);
  const deliveryFeeInput = useState<number>('deliveryFee', () => 0);
  const numberOfPeople = useState<number>('numberOfPeople', () => 1);
  const splitEqually = useState<boolean>('splitEqually', () => true);
  const people = useState<Person[]>('people', () => [{ items: [], name: '', paid: false }]);
  const serviceTaxType = useState<'amount' | 'percentage'>('serviceTaxType', () => 'amount');
  const serviceTaxIncluded = useState<boolean>('serviceTaxIncluded', () => false);
  const deliveryFeeIncluded = useState<boolean>('deliveryFeeIncluded', () => false);

  // Format price function
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Computed grand total
  const grandTotal = computed(() => {
    const itemsTotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceTaxAmount = serviceTaxIncluded.value
      ? (serviceTaxType.value === 'percentage'
        ? (itemsTotal * serviceTaxInput.value) / 100
        : serviceTaxInput.value)
      : 0;
    return itemsTotal + serviceTaxAmount + (deliveryFeeIncluded.value ? deliveryFeeInput.value : 0);
  });

  // Rounding functions
  const getRoundedAmount = (amount: number): number => {
    return Math.ceil(amount / 0.05) * 0.05;
  };

  const getRoundingAmount = (amount: number): number => {
    return getRoundedAmount(amount) - amount;
  };

  // Calculate per-person subtotal based on personItems
  const getPersonSubtotal = (index: number, personItems: Record<number, Record<string, { selected: boolean; quantity: number }>> = {}) => {
    const person = people.value[index];
    if (!person) return 0;
    const selections = personItems[index] || {};
    return person.items.reduce((sum, itemName) => {
      const item = items.value.find(i => i.name === itemName);
      if (!item) return sum;
      const quantity = selections[itemName]?.selected ? (selections[itemName].quantity || 1) : 1;
      return sum + (item.price * quantity);
    }, 0);
  };

  // Calculate per-person total
  const getPersonTotal = (index: number, personItems: Record<number, Record<string, { selected: boolean; quantity: number }>> = {}) => {
    const subtotal = getPersonSubtotal(index, personItems);
    const serviceTaxShare = serviceTaxIncluded.value
      ? (serviceTaxType.value === 'percentage'
        ? (subtotal * serviceTaxInput.value) / 100
        : serviceTaxInput.value / numberOfPeople.value)
      : 0;
    const deliveryFeeShare = deliveryFeeIncluded.value ? deliveryFeeInput.value / numberOfPeople.value : 0;
    return getRoundedAmount(subtotal + serviceTaxShare + deliveryFeeShare);
  };

  return {
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
  };
}