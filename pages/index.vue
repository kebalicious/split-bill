<template>
  <div
    class="bg-background-light dark:bg-background-dark min-h-screen text-text-light dark:text-text-dark transition-colors duration-300">
    <header
      class="bg-gradient-to-b from-primary-light/10 dark:from-primary-dark/10 to-transparent px-6 pt-16 pb-4 w-full">
      <div class="flex md:flex-row flex-col md:justify-between md:items-center gap-4 mx-auto max-w-6xl">
        <div>
          <h1 class="font-extrabold text-primary-light dark:text-primary-dark text-4xl tracking-tight">Split Bill</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300 text-lg">{{ $t('description') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="toggleLanguage"
            class="flex justify-center items-center self-start md:self-center bg-card-light hover:bg-primary-light dark:hover:bg-primary-dark dark:bg-card-dark p-2 border-2 border-primary-light dark:border-primary-dark rounded-full w-10 h-10 text-primary-light hover:text-card-light dark:hover:text-card-dark dark:text-primary-dark transition-all duration-300 cursor-pointer">
            <span v-if="locale === 'en'">🇲🇾<span class='ml-1 text-xs'>BM</span></span>
            <span v-else>🇬🇧<span class='ml-1 text-xs'>EN</span></span>
          </button>
          <button @click="toggleTheme"
            class="flex justify-center items-center self-start md:self-center bg-card-light hover:bg-primary-light dark:hover:bg-primary-dark dark:bg-card-dark p-2 border-2 border-primary-light dark:border-primary-dark rounded-full w-10 h-10 text-primary-light hover:text-card-light dark:hover:text-card-dark dark:text-primary-dark transition-all duration-300 cursor-pointer">
            <span v-if="isDarkMode">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>
      </div>
    </header>
    <main class="gap-8 grid grid-cols-1 lg:grid-cols-3 mx-auto py-10 w-full max-w-6xl">
      <!-- Left: Input Section -->
      <section class="flex flex-col gap-8 lg:col-span-2 bg-card-light dark:bg-card-dark shadow-lg p-8 rounded-xl">
        <div>
          <h2 class="mb-2 font-bold text-2xl">{{ $t('title') }}</h2>
          <p class="mb-6 text-gray-600 dark:text-gray-400">{{ $t('description') }}</p>
          <div class="flex gap-4 mb-8">
            <button :class="[
              'px-6 py-3 rounded-lg font-bold border-2 transition-all duration-300',
              mode === 'upload'
                ? 'border-primary-light dark:border-primary-dark bg-primary-light text-card-light dark:bg-primary-dark dark:text-card-dark'
                : 'border-primary-light dark:border-primary-dark bg-card-light text-primary-light dark:bg-card-dark dark:text-primary-dark hover:bg-primary-light hover:text-card-light dark:hover:bg-primary-dark dark:hover:text-card-dark'
            ]" @click="() => { mode = 'upload'; clearBillState(); }">
              {{ $t('upload') }}
            </button>
            <button :class="[
              'px-6 py-3 rounded-lg font-bold border-2 transition-all duration-300',
              mode === 'manual'
                ? 'border-primary-light dark:border-primary-dark bg-primary-light text-card-light dark:bg-primary-dark dark:text-card-dark'
                : 'border-primary-light dark:border-primary-dark bg-card-light text-primary-light dark:bg-card-dark dark:text-primary-dark hover:bg-primary-light hover:text-card-light dark:hover:bg-primary-dark dark:hover:text-card-dark'
            ]" @click="() => { mode = 'manual'; clearBillState(); }">
              {{ $t('manual') }}
            </button>
          </div>
          <div>
            <BillUpload v-if="mode === 'upload'" />
            <ManualEntry v-else />
          </div>
        </div>
      </section>
      <!-- Right: Summary Section -->
      <aside class="flex flex-col gap-6 bg-card-light dark:bg-card-dark shadow-lg p-8 rounded-xl">
        <h2 class="mb-4 font-bold text-primary-light dark:text-primary-dark text-xl">{{ $t('summary') }}</h2>
        <div class="flex flex-col gap-2">
          <div class="flex justify-between"><span>Jumlah Item</span><span class="font-semibold">0</span></div>
          <div class="flex justify-between"><span>Jumlah Keseluruhan</span><span class="font-semibold">RM 0.00</span>
          </div>
          <div class="flex justify-between"><span>Bilangan Orang</span><span class="font-semibold">0</span></div>
          <div class="flex justify-between"><span>Setiap Orang</span><span class="font-semibold">RM 0.00</span></div>
        </div>
        <div class="bg-primary-light/10 dark:bg-primary-dark/10 mt-6 p-4 rounded-lg text-center">
          <span class="block font-bold text-primary-light dark:text-primary-dark text-lg">Baki Perlu Bayar</span>
          <span class="block mt-2 font-extrabold text-3xl">RM 0.00</span>
        </div>
      </aside>
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