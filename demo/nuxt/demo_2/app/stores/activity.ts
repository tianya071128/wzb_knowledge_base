import { defineStore } from 'pinia';
import { getActiveInfo, type ActivityInfo } from '~/api';

export const useActivityStore = defineStore('activity_store', () => {
  const activity = ref<ActivityInfo[]>([]);

  return {
    activity,
    /** 初始获取 */
    async init() {
      const { data } = await useAsyncData('get-active', () => getActiveInfo());
      activity.value = data.value ?? [];
    },
  };
});
