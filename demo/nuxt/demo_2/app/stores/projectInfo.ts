import { defineStore } from 'pinia';
import { getProjectInfo, type ProjectInfo } from '~/api';

export const useProjectInfoStore = defineStore('projectInfoStore', () => {
  const projectInfo = ref<ProjectInfo>();

  return {
    projectInfo,
    /** 初始获取 */
    async init() {
      const { data } = await useAsyncData('get-project', () =>
        getProjectInfo()
      );

      if (data.value) {
        projectInfo.value = data.value;
      }
    },
  };
});
