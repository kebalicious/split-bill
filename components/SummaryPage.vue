<template>
  <div class="summary-page">
    <h1>{{ $t('summaryPage') }}</h1>
    <div class="user-bills">
      <UserBill
        v-for="(user, index) in users"
        :key="index"
        :user="user"
        :taxPerUser="taxPerUser"
        @paid="markAsPaid(index)"
      />
    </div>
  </div>
</template>

<script>
import UserBill from './UserBill.vue';
import { mapState } from 'vuex';

export default {
  name: 'SummaryPage',
  components: {
    UserBill
  },
  computed: {
    ...mapState(['users', 'taxPerUser'])
  },
  methods: {
    markAsPaid(index) {
      this.$store.commit('markUserAsPaid', index);
    }
  }
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