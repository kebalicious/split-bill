<template>
  <div v-if="mode === 'manual'">
    <div class="hidden sm:block bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
      <div class="flex justify-between items-center">
        <h2 class="font-bold text-md text-text-light dark:text-text-dark">{{ $t('summary') }}</h2>
        <div class="flex items-center gap-2">
          <button @click="saveAsPNG(selectedPersonIndex)"
            class="flex justify-center items-center bg-gray-100 dark:bg-gray-700 px-2 rounded-lg w-8 text-gray-600 dark:text-gray-300 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button @click="shareViaEmail(selectedPersonIndex)"
            class="flex justify-center items-center bg-gray-100 dark:bg-gray-700 px-2 rounded-lg w-8 text-gray-600 dark:text-gray-300 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
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
              class="p-2 border rounded w-20 text-gray-900 text-center"
              :disabled="!personItems[selectedPersonIndex][item.name].selected">
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
import { saveAs } from 'file-saver';
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n();

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

const downloadFile = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

const saveAsPNG = async (index: number) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Receipt style settings
  const width = 420;
  let y = 40;
  const lineHeight = 28;
  const leftPad = 32;
  const rightPad = width - 32;
  const mono = '16px "Fira Mono", "Consolas", "Menlo", monospace';
  const monoBold = 'bold 18px "Fira Mono", "Consolas", "Menlo", monospace';
  const monoSmall = 'italic 14px "Fira Mono", "Consolas", "Menlo", monospace';
  const sectionGap = 18;
  const dash = () => {
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    ctx.moveTo(leftPad, y);
    ctx.lineTo(rightPad, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    y += 12;
  };

  // Estimate height
  let estHeight = 600 + (items.value.length * 20) + (people.value.length * 40);
  canvas.width = width;
  canvas.height = estHeight;

  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, canvas.height);

  // Title
  ctx.font = monoBold;
  ctx.fillStyle = '#222';
  ctx.textAlign = 'center';
  ctx.fillText('SPLIT BILL RECEIPT', width / 2, y);
  y += lineHeight;

  // Date
  ctx.font = mono;
  ctx.fillStyle = '#444';
  ctx.fillText(new Date().toLocaleDateString(), width / 2, y);
  y += lineHeight - 8;

  dash();

  // Items
  ctx.textAlign = 'left';
  ctx.font = mono;
  ctx.fillStyle = '#222';
  ctx.fillText('Items:', leftPad, y);
  y += lineHeight - 8;
  items.value.forEach(item => {
    ctx.fillText(`${item.name} x${item.quantity}`, leftPad, y);
    ctx.textAlign = 'right';
    ctx.fillText(formatPrice(item.price * item.quantity), rightPad, y);
    ctx.textAlign = 'left';
    y += 22;
  });
  y += 4;
  dash();

  // Subtotal, taxes, fees
  ctx.font = mono;
  ctx.fillStyle = '#222';
  ctx.fillText('Subtotal', leftPad, y);
  ctx.textAlign = 'right';
  ctx.fillText(formatPrice(items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)), rightPad, y);
  ctx.textAlign = 'left';
  y += 22;
  if (serviceTaxIncluded.value) {
    const subtotal = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceTax = serviceTaxType.value === 'percentage'
      ? (subtotal * serviceTaxInput.value) / 100
      : serviceTaxInput.value;
    ctx.fillText('Service Tax', leftPad, y);
    ctx.textAlign = 'right';
    ctx.fillText(formatPrice(serviceTax), rightPad, y);
    ctx.textAlign = 'left';
    y += 22;
  }
  if (deliveryFeeIncluded.value) {
    ctx.fillText('Delivery Fee', leftPad, y);
    ctx.textAlign = 'right';
    ctx.fillText(formatPrice(deliveryFeeInput.value), rightPad, y);
    ctx.textAlign = 'left';
    y += 22;
  }
  dash();

  // Grand total
  ctx.font = monoBold;
  ctx.fillStyle = '#111';
  ctx.fillText('GRAND TOTAL', leftPad, y);
  ctx.textAlign = 'right';
  ctx.fillText(formatPrice(grandTotal.value), rightPad, y);
  ctx.textAlign = 'left';
  y += lineHeight;

  // Rounding
  ctx.font = monoSmall;
  ctx.fillStyle = '#666';
  ctx.fillText(`Rounding to: ${formatPrice(getRoundingAmount(grandTotal.value))}`, leftPad, y);
  y += sectionGap;
  dash();

  // People & split info
  ctx.font = mono;
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.fillText(`No. of people: ${numberOfPeople.value}`, leftPad, y);
  y += 22;
  ctx.fillText(`Split equally: ${splitEqually.value ? 'Yes' : 'No'}`, leftPad, y);
  y += sectionGap;
  dash();

  if (splitEqually.value) {
    ctx.font = monoBold;
    ctx.fillStyle = '#111';
    ctx.fillText('EACH PERSON PAYS', leftPad, y);
    ctx.textAlign = 'right';
    ctx.fillText(formatPrice(getRoundedAmount(grandTotal.value / numberOfPeople.value)), rightPad, y);
    ctx.textAlign = 'left';
    y += lineHeight;
    ctx.font = monoSmall;
    ctx.fillStyle = '#666';
    ctx.fillText(`Rounding to: ${formatPrice(getRoundingAmount(grandTotal.value / numberOfPeople.value))}`, leftPad, y);
    y += sectionGap;
  } else {
    ctx.font = monoBold;
    ctx.fillStyle = '#111';
    ctx.fillText('INDIVIDUAL BREAKDOWN', leftPad, y);
    y += lineHeight - 8;
    people.value.forEach((person, index) => {
      ctx.font = mono;
      ctx.fillStyle = '#222';
      ctx.fillText(`${person.name || `Person ${index + 1}`}:`, leftPad + 10, y);
      y += 20;
      person.items.forEach(itemName => {
        const item = items.value.find(i => i.name === itemName);
        if (!item) return;
        const quantity = personItems.value[index][itemName]?.quantity || 1;
        ctx.font = mono;
        ctx.fillText(`  ${item.name} x${quantity}`, leftPad + 20, y);
        ctx.textAlign = 'right';
        ctx.fillText(formatPrice(item.price * quantity), rightPad, y);
        ctx.textAlign = 'left';
        y += 18;
      });
      ctx.font = monoBold;
      ctx.fillStyle = '#111';
      ctx.fillText('  Total:', leftPad + 20, y);
      ctx.textAlign = 'right';
      ctx.fillText(formatPrice(getPersonTotal(index, personItems.value)), rightPad, y);
      ctx.textAlign = 'left';
      y += sectionGap;
    });
  }

  dash();
  ctx.font = monoSmall;
  ctx.fillStyle = '#888';
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for using Split Bill!', width / 2, y + 20);

  // Download
  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      const person = people.value[index];
      const personName = person.name || `Person ${index + 1}`;
      downloadFile(blob, `receipt-${personName}.png`);
    }
  });
};

const shareViaEmail = (index: number) => {
  const person = people.value[index];
  const personName = person.name || `Person ${index + 1}`;
  const subject = `Receipt for ${personName}`;
  const body = `Please find attached the receipt for ${personName}.\n\nTotal amount: ${formatPrice(getPersonTotal(index, personItems.value))}`;

  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
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