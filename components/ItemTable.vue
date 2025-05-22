<template>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'ItemTable',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style> 