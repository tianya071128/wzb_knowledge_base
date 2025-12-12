import { defineStore } from 'pinia';
import { getDictUrl, type DictUrlInfo } from '~/api';

export const useDictUrlStore = defineStore('dictUrl_store', () => {
  const dictUrl = ref<DictUrlInfo[]>([]);
  const projectInfoStore = useProjectInfoStore();

  return {
    dictUrl,
    /** 初始获取 */
    async init() {
      const { data } = await useAsyncData('get-dictUrl', () => getDictUrl());
      dictUrl.value = data.value ?? [];
    },
    /** 登录地址 */
    loginUrl: computed(() => {
      if (!projectInfoStore.projectInfo) {
        return '';
      }

      const url =
        dictUrl.value.find((item) => item.label === 'login')?.value ?? '';

      // 增加参数
      if (url) {
        return `${url}?systemId=${projectInfoStore.projectInfo.systemId}&projectNo=${projectInfoStore.projectInfo.projectNo}`;
      }
    }),
    /** 注册地址 */
    registerUrl: computed(() => {
      if (!projectInfoStore.projectInfo) {
        return '';
      }

      const url =
        dictUrl.value.find((item) => item.label === 'register')?.value ?? '';

      // 添加参数
      if (url) {
        return `${url}?systemId=${projectInfoStore.projectInfo.systemId}&projectNo=${projectInfoStore.projectInfo.projectNo}`;
      }
    }),
  };
});
