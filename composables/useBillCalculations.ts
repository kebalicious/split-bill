// composables/useBillCalculations.ts
import { ref, computed } from 'vue';
import { useState } from '#imports';

interface Item {
  name: string;
  price: number;
  quantity: number;
  people: string[];
}

interface Person {
  items: string[];
  name: string;
  paid: boolean;
}

// Currency configuration
export const currencies = {
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  USD: { symbol: '$', name: 'US Dollar' },
  GBP: { symbol: '£', name: 'British Pound Sterling' }
};

export function useBillCalculations() {
  // Shared state
  const items = ref<Item[]>([]);
  const serviceTaxInput = ref(0);
  const deliveryFeeInput = ref(0);
  const numberOfPeople = ref(1);
  const splitEqually = ref(true);
  const people = ref<Person[]>([{ items: [], name: '', paid: false }]);
  const serviceTaxType = ref<'amount' | 'percentage'>('percentage');
  const serviceTaxIncluded = ref(false);
  const deliveryFeeIncluded = ref(false);
  const selectedCurrency = useState<string>('selectedCurrency', () => 'MYR');

  // Format price function
  const formatPrice = (amount: number) => {
    const currency = currencies[selectedCurrency.value as keyof typeof currencies];
    return `${currency.symbol} ${amount.toFixed(2)}`;
  };

  // Computed grand total
  const grandTotal = computed(() => {
    const subtotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceTax = serviceTaxIncluded.value
      ? (serviceTaxType.value === 'percentage'
        ? (subtotal * serviceTaxInput.value) / 100
        : serviceTaxInput.value)
      : 0;
    const deliveryFee = deliveryFeeIncluded.value ? deliveryFeeInput.value : 0;
    return subtotal + serviceTax + deliveryFee;
  });

  // Rounding functions
  const getRoundedAmount = (amount: number) => {
    return Math.ceil(amount);
  };

  const getRoundingAmount = (amount: number) => {
    return getRoundedAmount(amount) - amount;
  };

  // Calculate per-person subtotal based on personItems
  const getPersonSubtotal = (personIndex: number, personItems: Record<number, Record<string, { selected: boolean; quantity: number }>>) => {
    return items.value.reduce((sum, item) => {
      const selection = personItems[personIndex]?.[item.name];
      if (selection?.selected) {
        return sum + item.price * selection.quantity;
      }
      return sum;
    }, 0);
  };

  // Calculate per-person total
  const getPersonTotal = (personIndex: number, personItems: Record<number, Record<string, { selected: boolean; quantity: number }>>) => {
    const subtotal = getPersonSubtotal(personIndex, personItems);
    const serviceTax = serviceTaxIncluded.value
      ? (serviceTaxType.value === 'percentage'
        ? (subtotal * serviceTaxInput.value) / 100
        : serviceTaxInput.value / numberOfPeople.value)
      : 0;
    const deliveryFee = deliveryFeeIncluded.value ? deliveryFeeInput.value / numberOfPeople.value : 0;
    return subtotal + serviceTax + deliveryFee;
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
    selectedCurrency,
    formatPrice,
    grandTotal,
    getRoundedAmount,
    getRoundingAmount,
    getPersonSubtotal,
    getPersonTotal,
    currencies
  };
}