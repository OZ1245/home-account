import { defineStore } from 'pinia';
import { IEntity } from 'src/@types/supabase'

export const useFinanceStore = defineStore('entities', {
  state: () => ({
    entities: [] as IEntity[],
  }),

  getters: {},

  actions: {
    setEntities (entities: IEntity[]) {
      this.entities = entities
    }
  }
});
