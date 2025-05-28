<template>
  <div v-if="mounted">
    <div class="space-y-4">
      <div class="bg-white dark:bg-card-dark shadow p-4 sm:p-6 rounded-xl">
        <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">{{ $t('addBillDetails') }}</h2>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex mb-0 pt-4 pb-4 border-b font-semibold text-gray-900 dark:text-white text-sm">
          <div class="w-20 sm:w-24">{{ $t('quantity') }}</div>
          <div class="flex-1">{{ $t('items') }}</div>
          <div class="w-20 sm:w-24 text-right">{{ $t('price') }}</div>
        </div>
        <div v-for="(item, index) in items" :key="index"
          class="flex items-center py-4 border-b last:border-b-0 text-gray-900 dark:text-white text-sm">
          <div class="flex items-center gap-2 w-20 sm:w-24">
            <template v-if="editingItemIndex === index">
              <button @click="decrementQuantity(index)" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="w-[1rem] font-medium text-center">{{ item.quantity }}</span>
              <button @click="incrementQuantity(index)" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </template>
            <template v-else>
              <span>{{ item.quantity }}</span>
            </template>
          </div>
          <div class="flex-1">
            <template v-if="editingItemIndex === index">
              <div class="flex items-center gap-2">
                <input v-model="editItem.name" type="text"
                  class="bg-white dark:bg-white p-2 border rounded-lg focus:outline-blue-200 w-full text-gray-900"
                  :placeholder="$t('itemName')" />
                <input v-model="editItem.price" type="number"
                  class="bg-white dark:bg-white p-2 border rounded-lg focus:outline-blue-200 w-24 text-gray-900 text-end"
                  placeholder="0.00" />
                <button @click="saveEditItem(index)" class="p-1 text-green-600 hover:text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button @click="cancelEdit" class="p-1 text-red-600 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </template>
            <template v-else>
              {{ item.name }}
            </template>
          </div>
          <div class="w-20 sm:w-24 text-right">{{ formatPrice(item.price * item.quantity) }}</div>
          <div class="flex items-center gap-2 ml-2">
            <button v-if="editingItemIndex !== index" @click="startEdit(index)"
              class="text-gray-400 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button v-if="editingItemIndex !== index" @click="deleteItem(index)"
              class="text-gray-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="items.length === 0 && !isAddingItem"
          class="flex justify-center items-center pt-8 pb-0 text-gray-500 dark:text-gray-400 text-sm">
          {{ $t('noItemAdded') }}
        </div>
        <!-- Add Item Row -->
        <div v-if="!isAddingItem"
          class="flex justify-center items-center gap-2 bg-primary-light hover:bg-primary-light/90 active:bg-primary-light/90 dark:hover:bg-primary-dark/90 dark:active:bg-primary-dark/90 dark:bg-primary-dark my-8 p-3 border border-primary-light dark:border-primary-dark rounded-xl font-medium text-card-light dark:text-card-dark text-sm transition cursor-pointer"
          @click="startAddItem">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="2" fill="none" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
          </svg>
          <span class="font-medium">{{ $t('addItem') }}</span>
        </div>
        <div v-else class="flex items-center py-4 border-b last:border-b-0 text-gray-900 dark:text-white text-sm">
          <div class="flex items-center gap-2 w-20 sm:w-24">
            <button @click="decrementNewItemQuantity" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="w-[1rem] font-medium text-center">{{ newItem.quantity }}</span>
            <button @click="incrementNewItemQuantity" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <input v-model="newItem.name" type="text" 
                class="bg-white dark:bg-white p-2 border rounded-lg focus:outline-blue-200 w-full text-gray-900"
                :placeholder="$t('itemName')" />
              <input v-model="newItem.price" type="number" 
                class="bg-white dark:bg-white p-2 border rounded-lg focus:outline-blue-200 w-24 text-gray-900 text-end"
                placeholder="0.00" />
              <button @click="saveNewItem" 
                class="p-1 text-green-600 hover:text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button @click="cancelAddItem" 
                class="p-1 text-red-600 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-20 sm:w-24 text-right">{{ formatPrice(newItem.price * newItem.quantity) }}</div>
        </div>
        <div class="my-4 border-t border-dashed"></div>
        <div class="flex flex-col gap-1 text-sm">
          <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">{{ $t('subtotal')
              }}</span><span class="text-gray-900 dark:text-white">{{
                formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}}</span></div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex flex-col sm:flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center"><span class="text-gray-500 dark:text-gray-400">{{
                  $t('serviceTaxIncluded')
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
                  <label for="serviceTax" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{
                    $t('serviceTax')
                    }}</label>
                  <div class="relative w-1/2">
                    <div class="top-1/2 left-0 absolute flex items-center gap-1 pl-2 -translate-y-1/2">
                      <button @click="serviceTaxType = 'amount'" :class="[
                        'px-2 py-1 text-xs rounded w-12',
                        serviceTaxType === 'amount'
                          ? 'bg-primary-light dark:bg-primary-dark text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      ]">
                        {{ currencies[selectedCurrency as keyof typeof currencies].symbol }}
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
                      @focus="(e: FocusEvent) => (e.target as HTMLInputElement).value = ''" />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-1 min-w-[200px]">
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center"><span class="text-gray-500 dark:text-gray-400">{{
                  $t('deliveryFeeIncluded')
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
                  <label for="deliveryFee" class="block w-1/2 font-medium text-gray-900 cursor-pointer">{{
                    $t('deliveryFee')
                    }}</label>
                  <input id="deliveryFee" v-model.number="deliveryFeeInput" type="number" min="0" max="999.99"
                    step="0.01" class="bg-white dark:bg-white outline-none w-1/2 text-gray-900 text-end"
                    placeholder="0.00" @focus="(e: FocusEvent) => (e.target as HTMLInputElement).value = ''" />
                </div>
              </div>
            </div>
          </div>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex justify-between font-bold text-base"><span class="text-gray-900 dark:text-white">{{
            $t('grandTotal')
              }}</span><span class="text-gray-900 dark:text-white">{{
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
                <span class="w-[2rem] font-medium text-center">{{ numberOfPeople }}</span>
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
              <div class="font-bold text-gray-900 dark:text-white text-xl">{{ formatPrice(getRoundedAmount(grandTotal /
                numberOfPeople)) }}</div>
              <div class="mt-1 text-gray-400 dark:text-gray-500 text-sm">{{ $t('roundedBy') }}: {{
                formatPrice(getRoundingAmount(grandTotal /
                numberOfPeople)) }}</div>
            </div>
            <div v-else>
              <div class="flex flex-col gap-4">
                <button v-for="(person, index) in people" :key="index" @click="openPersonModal(index)" :class="[
                  'hover:bg-gray-50 dark:hover:bg-gray-800 p-4 border rounded-lg text-center relative',
                  person.paid ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                ]">
                  <div class="mb-1 text-gray-500 dark:text-gray-400 text-sm">{{ person.name || `${$t('person')} ${index
                    + 1}`
                    }}</div>
                  <div class="font-bold text-gray-900 dark:text-white text-lg">{{ formatPrice(getPersonTotal(index,
                    personItems)) }}</div>
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
          class="bg-white dark:bg-white p-3 border rounded-lg focus:outline-blue-200 w-full text-gray-900 text-gray-900"
          placeholder="Enter name" />
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
              class="p-2 border rounded w-20 text-gray-900" :disabled="!personItems[selectedPersonIndex][item.name].selected">
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
            <span class="font-bold text-gray-900 dark:text-white">{{ formatPrice(getPersonSubtotal(selectedPersonIndex,
              personItems)) }}</span>
          </div>
          <div v-if="serviceTaxIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500 dark:text-gray-400">Service Tax ({{ numberOfPeople }} people):</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems)
              -
              getPersonSubtotal(selectedPersonIndex, personItems) - (deliveryFeeIncluded ? deliveryFeeInput
                / numberOfPeople : 0)) }}</span>
          </div>
          <div v-if="deliveryFeeIncluded" class="flex justify-between items-center mb-4">
            <span class="text-gray-500 dark:text-gray-400">Delivery Fee ({{ numberOfPeople }} people):</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(deliveryFeeInput / numberOfPeople) }}</span>
          </div>
          <div class="flex justify-between items-center font-bold text-lg">
            <span class="text-gray-900 dark:text-white">Total:</span>
            <span class="text-gray-900 dark:text-white">{{ formatPrice(getPersonTotal(selectedPersonIndex, personItems))
              }}</span>
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
          <div class="flex gap-2">
            <button @click="downloadReceipt(selectedPersonIndex)" 
              class="flex flex-1 justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button @click="saveAsPNG(selectedPersonIndex)"
              class="flex flex-1 justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              PNG
            </button>
            <button @click="saveAsPDF(selectedPersonIndex)"
              class="flex flex-1 justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </button>
          </div>
          <button @click="shareViaEmail(selectedPersonIndex)"
            class="flex justify-center items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl w-full font-bold text-gray-700 dark:text-gray-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Share via Email
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useBillCalculations } from '~/composables/useBillCalculations';
import html2canvas from 'html2canvas';
import { useI18n } from 'vue-i18n';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with fonts
if (typeof window !== 'undefined') {
  (pdfMake as any).vfs = (pdfFonts as any).vfs;
}

interface Item {
  name: string
  price: number
  quantity: number
  people: string[]
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
  getPersonTotal
} = useBillCalculations();

// Add currencies import
const { currencies } = useBillCalculations();

// Add item state
const isAddingItem = ref(false);
const newItem = ref<Item>({
  name: '',
  price: 0,
  quantity: 1,
  people: []
});

const startAddItem = () => {
  isAddingItem.value = true;
  newItem.value = {
    name: '',
    price: 0,
    quantity: 1,
    people: []
  };
};

const cancelAddItem = () => {
  isAddingItem.value = false;
  newItem.value = {
    name: '',
    price: 0,
    quantity: 1,
    people: []
  };
};

const saveNewItem = () => {
  if (!isValidNewItem.value) return;

  items.value.push({
    name: newItem.value.name,
    price: newItem.value.price,
    quantity: newItem.value.quantity,
    people: []
  });

  isAddingItem.value = false;
  newItem.value = {
    name: '',
    price: 0,
    quantity: 1,
    people: []
  };
};

const incrementNewItemQuantity = () => {
  newItem.value.quantity++;
};

const decrementNewItemQuantity = () => {
  if (newItem.value.quantity > 1) {
    newItem.value.quantity--;
  }
};

// Edit item state
const editingItemIndex = ref<number | null>(null);
const editItem = ref<Item>({
  name: '',
  price: 0,
  quantity: 1,
  people: []
});

const startEdit = (index: number) => {
  editingItemIndex.value = index;
  editItem.value = {
    name: items.value[index].name,
    price: items.value[index].price,
    quantity: items.value[index].quantity,
    people: items.value[index].people
  };
};

const cancelEdit = () => {
  editingItemIndex.value = null;
  editItem.value = {
    name: '',
    price: 0,
    quantity: 1,
    people: []
  };
};

const saveEditItem = (index: number) => {
  if (!isValidEditItem.value) return

  items.value[index] = {
    name: editItem.value.name,
    price: editItem.value.price,
    quantity: editItem.value.quantity,
    people: items.value[index].people
  }

  editingItemIndex.value = null
  editItem.value = {
    name: '',
    price: 0,
    quantity: 1,
    people: []
  }
}

const deleteItem = (index: number) => {
  items.value.splice(index, 1);
};

const incrementQuantity = (index: number) => {
  items.value[index].quantity++;
};

const decrementQuantity = (index: number) => {
  if (items.value[index].quantity > 1) {
    items.value[index].quantity--;
  }
};

// Person items modal
const showPersonModal = ref(false);
const selectedPersonIndex = ref(0);
const personItems = ref<Record<number, Record<string, { selected: boolean; quantity: number }>>>({});

// Initialize personItems
watch(numberOfPeople, (newValue: number) => {
  for (let i = 0; i < newValue; i++) {
    if (!personItems.value[i]) {
      personItems.value[i] = {};
      items.value.forEach((item: Item) => {
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

watch(items, (newItems: Item[]) => {
  Object.keys(personItems.value).forEach(personIndex => {
    newItems.forEach((item: Item) => {
      if (!personItems.value[parseInt(personIndex)][item.name]) {
        personItems.value[parseInt(personIndex)][item.name] = { selected: people.value[parseInt(personIndex)]?.items.includes(item.name) || false, quantity: 1 };
      }
    });
    Object.keys(personItems.value[parseInt(personIndex)]).forEach(itemName => {
      if (!newItems.find((item: Item) => item.name === itemName)) {
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
    .filter(([_, selection]: [string, { selected: boolean; quantity: number }]) => selection.selected)
    .map(([itemName]) => itemName);
  people.value[selectedPersonIndex.value].items = selectedItems;
  closePersonModal();
};

const isItemFullySelected = (itemName: string, currentPersonIndex: number): boolean => {
  const item = items.value.find((i: Item) => i.name === itemName);
  if (!item) return false;
  const totalSelected = Object.entries(personItems.value).reduce((sum: number, [personIndex, items]) => {
    const index = parseInt(personIndex);
    if (index === currentPersonIndex) return sum;
    return sum + (items[itemName]?.selected ? (items[itemName]?.quantity || 0) : 0);
  }, 0);
  return totalSelected >= item.quantity;
};

const getAvailableQuantity = (itemName: string, currentPersonIndex: number): number[] => {
  const item = items.value.find((i: Item) => i.name === itemName);
  if (!item) return [];
  const totalSelected = Object.entries(personItems.value).reduce((sum: number, [personIndex, items]) => {
    const index = parseInt(personIndex);
    if (index === currentPersonIndex) return sum;
    return sum + (items[itemName]?.selected ? (items[itemName]?.quantity || 0) : 0);
  }, 0);
  const available = item.quantity - totalSelected;
  return Array.from({ length: available }, (_, i: number) => i + 1);
};

const markAsPaid = (index: number) => {
  people.value[index].paid = !people.value[index].paid;
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

const isValidNewItem = computed(() => {
  return newItem.value.name.trim() !== '' && newItem.value.price > 0
})

const isValidEditItem = computed(() => {
  return editItem.value.name.trim() !== '' && editItem.value.price > 0
})

// Receipt generation and sharing functions
interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface ReceiptContent {
  personName: string;
  items: ReceiptItem[];
  subtotal: number;
  serviceTax: number;
  deliveryFee: number;
  total: number;
  date: string;
}

const { t } = useI18n();

const generateReceiptContent = (personIndex: number): ReceiptContent => {
  const person = people.value[personIndex];
  const personName = person.name || `${t('person')} ${personIndex + 1}`;
  const receiptItems = person.items.map(itemName => {
    const item = items.value.find(i => i.name === itemName);
    if (!item) return null;
    const quantity = personItems.value[personIndex][itemName]?.quantity || 1;
    return {
      name: item.name,
      price: item.price,
      quantity,
      total: item.price * quantity
    };
  }).filter((item): item is ReceiptItem => item !== null);

  const subtotal = getPersonSubtotal(personIndex, personItems.value);
  const serviceTax = serviceTaxIncluded.value
    ? (serviceTaxType.value === 'percentage'
      ? (subtotal * serviceTaxInput.value) / 100
      : serviceTaxInput.value / numberOfPeople.value)
    : 0;
  const deliveryFee = deliveryFeeIncluded.value ? deliveryFeeInput.value / numberOfPeople.value : 0;
  const total = getPersonTotal(personIndex, personItems.value);

  return {
    personName,
    items: receiptItems,
    subtotal,
    serviceTax,
    deliveryFee,
    total,
    date: new Date().toLocaleDateString()
  };
};

const generateReceiptHTML = (content: ReturnType<typeof generateReceiptContent>) => {
  return `
    <div class="bg-white mx-auto p-6 max-w-md receipt">
      <div class="mb-4 text-center">
        <h1 class="font-bold text-xl">Receipt</h1>
        <p class="text-gray-600">${content.date}</p>
      </div>
      <div class="mb-4">
        <h2 class="font-bold">${content.personName}</h2>
      </div>
      <div class="mb-4 py-4 border-t border-b">
        ${content.items.map(item => `
          <div class="flex justify-between mb-2">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.total)}</span>
          </div>
        `).join('')}
      </div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span>${formatPrice(content.subtotal)}</span>
        </div>
        ${content.serviceTax > 0 ? `
          <div class="flex justify-between">
            <span>Service Tax:</span>
            <span>${formatPrice(content.serviceTax)}</span>
          </div>
        ` : ''}
        ${content.deliveryFee > 0 ? `
          <div class="flex justify-between">
            <span>Delivery Fee:</span>
            <span>${formatPrice(content.deliveryFee)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between pt-2 border-t font-bold">
          <span>Total:</span>
          <span>${formatPrice(content.total)}</span>
        </div>
      </div>
    </div>
  `;
};

// Helper function to download file
const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const downloadReceipt = async (personIndex: number) => {
  const content = generateReceiptContent(personIndex);
  const html = generateReceiptHTML(content);
  const blob = new Blob([html], { type: 'text/html' });
  downloadFile(blob, `receipt-${content.personName}.html`);
};

const saveAsPNG = async (personIndex: number) => {
  const content = generateReceiptContent(personIndex);
  const html = generateReceiptHTML(content);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  document.body.appendChild(tempDiv);
  
  try {
    const canvas = await html2canvas(tempDiv);
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        downloadFile(blob, `receipt-${content.personName}.png`);
      }
    });
  } finally {
    document.body.removeChild(tempDiv);
  }
};

const saveAsPDF = async (personIndex: number) => {
  const content = generateReceiptContent(personIndex);
  const docDefinition = {
    content: [
      { text: 'Receipt', style: 'header' },
      { text: content.date, style: 'subheader' },
      { text: content.personName, style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Item', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader' }
            ],
            ...content.items.map(item => [
              { text: `${item.name} x${item.quantity}` },
              { text: formatPrice(item.total), alignment: 'right' as const }
            ]),
            [
              { text: 'Subtotal:', style: 'tableHeader' },
              { text: formatPrice(content.subtotal), alignment: 'right' as const }
            ],
            ...(content.serviceTax > 0 ? [[
              { text: 'Service Tax:', style: 'tableHeader' },
              { text: formatPrice(content.serviceTax), alignment: 'right' as const }
            ]] : []),
            ...(content.deliveryFee > 0 ? [[
              { text: 'Delivery Fee:', style: 'tableHeader' },
              { text: formatPrice(content.deliveryFee), alignment: 'right' as const }
            ]] : []),
            [
              { text: 'Total:', style: 'totalHeader' },
              { text: formatPrice(content.total), style: 'totalAmount', alignment: 'right' as const }
            ]
          ]
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] as [number, number, number, number],
        alignment: 'center' as const
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5] as [number, number, number, number],
        alignment: 'left' as const
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
        margin: [0, 5, 0, 5] as [number, number, number, number],
        alignment: 'left' as const
      },
      totalHeader: {
        bold: true,
        fontSize: 14,
        margin: [0, 10, 0, 5] as [number, number, number, number]
      },
      totalAmount: {
        bold: true,
        fontSize: 14,
        margin: [0, 10, 0, 5] as [number, number, number, number]
      }
    }
  };

  pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
    downloadFile(blob, `receipt-${content.personName}.pdf`);
  });
};

const shareViaEmail = (personIndex: number) => {
  const content = generateReceiptContent(personIndex);
  const subject = `Receipt for ${content.personName}`;
  const body = `Please find attached the receipt for ${content.personName}.\n\nTotal amount: ${formatPrice(content.total)}`;
  
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
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

/* Receipt styles */
:deep(.receipt) {
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  line-height: 1.5;
}

:deep(.receipt h1) {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

:deep(.receipt h2) {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

:deep(.receipt .text-gray-600) {
  color: #666;
}

:deep(.receipt .border-t),
:deep(.receipt .border-b) {
  border-color: #e5e7eb;
}

:deep(.receipt .space-y-2 > * + *) {
  margin-top: 0.5rem;
}

:deep(.receipt .font-bold) {
  font-weight: 600;
}
</style>