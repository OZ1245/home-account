import { defineStore } from 'pinia';
import { IEntity } from 'src/@types/supabase'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
    entities: [] as IEntity[],
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2;
    }
  },

  actions: {
    increment () {
      this.counter++;
    }
  }
});
