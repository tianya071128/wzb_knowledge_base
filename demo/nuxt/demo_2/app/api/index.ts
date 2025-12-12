import request from './request';

export interface ActivityInfo {
  id: string;
  /** 图片地址 */
  imageUrl: string;
  /** 跳转链接 */
  url: string;
  /** 按钮文字 */
  buttonName: string;
}
/** API - 获取活动信息 */
export function getActiveInfo() {
  return request<ActivityInfo[]>('/article/button', {
    method: 'GET',
  });
}

export interface DictUrlInfo {
  /** 类型 */
  label: 'login' | 'register';
  /** 跳转链接 */
  value: string;
}
/** API - 获取相关地址 */
export function getDictUrl() {
  return request<DictUrlInfo[]>(
    'https://uums.easysign.cn/statement/account/getDictUrl',
    {
      method: 'GET',
      params: {
        type: 'UUMS_PC',
      },
    }
  );
}

export interface ProjectInfo {
  /** 项目编号 */
  projectNo: string;
  /** 项目id */
  systemId: string;
}
/** API -- 获取项目信息 */
export function getProjectInfo() {
  return request<ProjectInfo>('https://ht.easysign.cn/common/getProjectName');
}

export interface HomeCarouselInfo {
  /** id */
  id: string;
  /** 图片地址 */
  imageUrl: string;
  /** 文本 */
  seoKey: string;
}
/** API -- 获取首页轮播图信息 */
export function getHomeCarouselList() {
  return request<HomeCarouselInfo[]>('/article/listCarouselHomePage', {
    method: 'POST',
    body: {
      pageNum: 1,
      pageSize: 10,
    },
  });
}
