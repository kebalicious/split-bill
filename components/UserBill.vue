<template>
  <div class="user-bill">
    <h2>{{ $t('userBill', { name: user.name }) }}</h2>
    <table>
      <thead>
        <tr>
          <th>{{ $t('items') }}</th>
          <th>{{ $t('quantity') }}</th>
          <th>{{ $t('price') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in user.items" :key="index">
          <td>{{ items[index].name }}</td>
          <td>{{ item }}</td>
          <td>{{ items[index].price * item }}</td>
        </tr>
      </tbody>
    </table>
    <p>{{ $t('total') }}: {{ calculateTotal() }}</p>
    <p>{{ $t('tax') }}: {{ taxPerUser }}</p>
    <p>{{ $t('grandTotal') }}: {{ calculateTotal() + taxPerUser }}</p>
    <button @click="downloadBill">{{ $t('downloadPNG') }}</button>
    <button @click="markAsPaid">{{ $t('done') }}</button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import { mapState } from 'vuex';

export default {
  name: 'UserBill',
  props: {
    user: {
      type: Object,
      required: true
    },
    taxPerUser: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['items'])
  },
  methods: {
    calculateTotal() {
      return this.user.items.reduce((sum, quantity, index) => sum + quantity * this.items[index].price, 0);
    },
    async downloadBill() {
      const element = this.$el;
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${this.user.name}_bill.png`;
      link.click();
    },
    markAsPaid() {
      this.$emit('paid');
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style> 