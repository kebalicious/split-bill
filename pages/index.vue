<template>
  <div
    class="bg-background-light dark:bg-background-dark min-h-screen text-text-light dark:text-text-dark transition-colors duration-300">
    <header
      class="bg-gradient-to-b from-primary-light/10 dark:from-primary-dark/10 to-transparent px-6 pt-16 pb-4 w-full">
      <div class="flex md:flex-row flex-col md:justify-between md:items-center gap-4 mx-auto max-w-6xl">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-extrabold text-primary-light dark:text-primary-dark text-2xl tracking-tight">Split Bill</h1>
            <span
              class="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full font-bold text-yellow-800 dark:text-yellow-200 text-xs">ALPHA</span>
          </div>
          <p class="mt-2 text-gray-600 dark:text-gray-300 text-sm">{{ $t('subtitle') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="toggleLanguage"
            class="flex justify-center items-center self-start md:self-center bg-card-light hover:bg-primary-light dark:hover:bg-primary-dark dark:bg-card-dark px-4 py-2 rounded-xl w-auto h-10 font-medium text-primary-light hover:text-card-light dark:hover:text-card-dark dark:text-primary-dark text-sm transition-all duration-300 cursor-pointer">
            <span v-if="locale === 'en'" class="flex items-center gap-2"><img src="/assets/img/my.svg"
                alt="Malaysia Flag" class="w-5 h-5" /> MS</span>
            <span v-else class="flex items-center gap-2"><img src="/assets/img/gb.svg" alt="UK Flag" class="w-5 h-5" />
              EN</span>
          </button>
          <button @click="toggleTheme"
            class="flex justify-center items-center self-start md:self-center bg-card-light hover:bg-primary-light dark:hover:bg-primary-dark dark:bg-card-dark px-4 py-2 rounded-xl w-auto h-10 font-medium text-primary-light hover:text-card-light dark:hover:text-card-dark dark:text-primary-dark text-sm transition-all duration-300 cursor-pointer">
            <span v-if="isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </header>
    <main class="gap-8 grid grid-cols-1 lg:grid-cols-3 mx-auto px-6 sm:px-0 py-10 w-full max-w-6xl">
      <!-- Left: Input Section -->
      <!-- <section class="flex flex-col gap-8 lg:col-span-2 bg-card-light dark:bg-card-dark shadow-lg p-8 rounded-xl"> -->
      <div>
        <div class="bg-card-light dark:bg-card-dark shadow-sm p-4 rounded-xl">
          <h2 class="mb-4 font-bold text-md text-text-light dark:text-text-dark">Choose how to enter your bill details
          </h2>
          <div class="my-4 border-t border-dashed"></div>
          <div class="flex gap-4">
            <button :class="[
              'px-6 py-3 rounded-xl font-medium border-1 transition-all duration-300 w-full text-sm',
              mode === 'upload'
                ? 'border-primary-light dark:border-primary-dark bg-primary-light text-card-light dark:bg-primary-dark dark:text-card-dark'
                : 'border-primary-light dark:border-primary-dark bg-gray-100 text-primary-light dark:bg-card-dark dark:text-primary-dark hover:bg-primary-light hover:text-card-light dark:hover:bg-primary-dark dark:hover:text-card-dark'
            ]" @click="() => { mode = 'upload'; clearBillState(); }">
              <svg class="mx-auto mb-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
              </svg>
              {{ $t('upload') }}
            </button>
            <button :class="[
              'px-6 py-3 rounded-xl font-medium border-1 transition-all duration-300 w-full text-sm',
              mode === 'manual'
                ? 'border-primary-light dark:border-primary-dark bg-primary-light text-card-light dark:bg-primary-dark dark:text-card-dark'
                : 'border-primary-light dark:border-primary-dark bg-gray-100 text-primary-light dark:bg-card-dark dark:text-primary-dark hover:bg-primary-light hover:text-card-light dark:hover:bg-primary-dark dark:hover:text-card-dark'
            ]" @click="() => { mode = 'manual'; clearBillState(); }">
              <svg class="mx-auto mb-2 w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ $t('manual') }}
            </button>
          </div>
        </div>
        <div class="my-4">
          <BillUpload v-if="mode === 'upload'" @change-mode="mode = $event" />
          <ManualEntry v-else />
        </div>
      </div>
      <!-- </section> -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useThemeStore } from '~/store/theme';
import BillUpload from '~/components/BillUpload.vue';
import ManualEntry from '~/components/ManualEntry.vue';
import { useI18n } from '#imports';

// Shared state keys
import { useState } from '#imports';
const items = useState<any[]>('items', () => []);
const serviceTax = useState<number>('serviceTax', () => 0);
const grandTotal = useState<number>('grandTotal', () => 0);
const newItem = useState<any>('newItem', () => ({ name: '', price: 0 }));

const mode = ref<'upload' | 'manual'>('upload');

const clearBillState = () => {
  items.value = [];
  serviceTax.value = 0;
  grandTotal.value = 0;
  newItem.value = { name: '', price: 0 };
};

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.isDarkMode.value);

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const { locale, setLocale } = useI18n();
const toggleLanguage = () => {
  setLocale(locale.value === 'en' ? 'ms' : 'en');
};

onMounted(() => {
  themeStore.initTheme();
});
</script>