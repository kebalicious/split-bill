<template>
  <div class="summary-page">
    <h2>Summary</h2>
    <div v-for="(user, index) in users" :key="index">
      <h3>{{ user.name }}</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, itemIndex) in user.items" :key="itemIndex">
            <td>{{ items[itemIndex].name }}</td>
            <td>{{ item }}</td>
            <td>{{ items[itemIndex].price * item }}</td>
          </tr>
        </tbody>
      </table>
      <p>Total: {{ calculateUserTotal(user) }}</p>
      <p>Tax: {{ taxPerUser }}</p>
      <p>Grand Total: {{ calculateUserTotal(user) + taxPerUser }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SummaryPage',
  computed: {
    ...mapState(['users', 'items', 'serviceTax']),
    taxPerUser() {
      return this.serviceTax / this.users.length;
    }
  },
  methods: {
    calculateUserTotal(user) {
      return user.items.reduce((sum, quantity, index) => sum + quantity * this.items[index].price, 0);
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style> 