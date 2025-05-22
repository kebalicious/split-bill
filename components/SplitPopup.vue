<template>
  <div class="split-popup">
    <h2>{{ $t('splitOurBills') }}</h2>
    <div v-for="(user, index) in users" :key="index">
      <input v-model="user.name" :placeholder="$t('userName')" />
      <div v-for="(item, itemIndex) in items" :key="itemIndex">
        <label>
          {{ item.name }} ({{ item.price }})
          <input type="number" v-model.number="user.items[itemIndex]" min="0" />
        </label>
      </div>
      <p>{{ $t('total') }}: {{ calculateUserTotal(user) }}</p>
    </div>
    <button @click="addUser">{{ $t('addUser') }}</button>
    <button @click="calculateTotals">{{ $t('calculateTotals') }}</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SplitPopup',
  computed: {
    ...mapState(['items', 'users', 'serviceTax'])
  },
  methods: {
    ...mapActions(['updateUsers']),
    addUser() {
      const newUsers = [...this.users, { name: '', items: Array(this.items.length).fill(0) }];
      this.updateUsers(newUsers);
    },
    calculateUserTotal(user) {
      return user.items.reduce((sum, quantity, index) => sum + quantity * this.items[index].price, 0);
    },
    calculateTotals() {
      const userTotals = this.users.map(user => this.calculateUserTotal(user));
      const taxPerUser = this.serviceTax / this.users.length;
      console.log('User Totals:', userTotals);
      console.log('Tax Per User:', taxPerUser);
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style> 