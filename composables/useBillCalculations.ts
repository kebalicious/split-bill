// composables/useBillCalculations.ts
import { computed } from 'vue';
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
  // Shared state using useState
  const items = useState<Item[]>('items', () => []);
  const serviceTaxInput = useState<number>('serviceTaxInput', () => 0);
  const deliveryFeeInput = useState<number>('deliveryFeeInput', () => 0);
  const otherChargesInput = useState<number>('otherChargesInput', () => 0);
  const numberOfPeople = useState<number>('numberOfPeople', () => 1);
  const splitEqually = useState<boolean>('splitEqually', () => true);
  const people = useState<Person[]>('people', () => [{ items: [], name: '', paid: false }]);
  const serviceTaxType = useState<'amount' | 'percentage'>('serviceTaxType', () => 'percentage');
  const serviceTaxIncluded = useState<boolean>('serviceTaxIncluded', () => false);
  const deliveryFeeIncluded = useState<boolean>('deliveryFeeIncluded', () => false);
  const otherChargesIncluded = useState<boolean>('otherChargesIncluded', () => false);
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
    const otherCharges = otherChargesIncluded.value ? otherChargesInput.value : 0;
    return subtotal + serviceTax + deliveryFee + otherCharges;
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
    otherChargesInput,
    numberOfPeople,
    splitEqually,
    people,
    serviceTaxType,
    serviceTaxIncluded,
    deliveryFeeIncluded,
    otherChargesIncluded,
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