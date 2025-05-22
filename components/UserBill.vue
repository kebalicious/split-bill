<template>
  <div class="user-bill">
    <h2>{{ user.name }}'s Bill</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
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
    <p>Total: {{ calculateTotal() }}</p>
    <p>Tax: {{ taxPerUser }}</p>
    <p>Grand Total: {{ calculateTotal() + taxPerUser }}</p>
    <button @click="downloadBill">Download PNG</button>
    <button @click="markAsPaid">Done</button>
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