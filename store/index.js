import { createStore } from 'vuex';

export default createStore({
  state: {
    items: [],
    users: [],
    serviceTax: 0,
    grandTotal: 0
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setServiceTax(state, tax) {
      state.serviceTax = tax;
    },
    setGrandTotal(state, total) {
      state.grandTotal = total;
    }
  },
  actions: {
    updateItems({ commit }, items) {
      commit('setItems', items);
    },
    updateUsers({ commit }, users) {
      commit('setUsers', users);
    },
    updateServiceTax({ commit }, tax) {
      commit('setServiceTax', tax);
    },
    updateGrandTotal({ commit }, total) {
      commit('setGrandTotal', total);
    }
  },
  getters: {
    getItems: state => state.items,
    getUsers: state => state.users,
    getServiceTax: state => state.serviceTax,
    getGrandTotal: state => state.grandTotal
  }
}); 