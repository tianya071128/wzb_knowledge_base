// declare 关键字的重要特点:
//  1. 它只是通知编译器某个类型是存在的，不用给出具体实现。  比如，只描述函数的类型，不给出函数的实现，如果不使用declare，这是做不到的。
//  2. 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构

// declare 关键字可以描述以下类型:
//  变量（const、let、var 命令声明）
//  type 或者 interface 命令声明的类型
//  class
//  enum
//  函数（function）
//  模块（module）
//  命名空间（namespace）

// 1. 定义外部变量
{
  declare let x: number; // 定义一个外部变量
}

// 2. 定义外部函数
declare function bar(s: string): string;

// 3. 定义外部 class
declare class Animal {
  constructor(name: string);
  eat(): void;
  sleep(): void;
}

// 4. 定义全局变量
// 注意: 必须是模块脚本才有效, 所以如果没有导入导出的话, 那么就加一个 export {}
declare global {
  // declare 关键字在里面不是必须的
  declare const bar_global: number;
}

// 5. 为没有声明文件的库增加类型
// 注意: 这个就不能是模块脚本, 否则无效
declare module 'eslint4b-prebuilt' {
  export const test: any;
}

// 6. 扩展第三方库的类型
declare module 'axios' {
  interface AxiosRequestConfig {
    /** 隐藏业务层面接口报错 */
    hideBusinessError?: boolean;
    /** 隐藏接口报错 */
    hideError?: boolean;
    /** 不处理的 code 列表 */
    customCode?: string | string[];
    /** loading */
    isLoading?: boolean | string;
    /** 直接返回全部数据 */
    allIn?: boolean;
    /* 文件下载 */
    downloadFile?: boolean;
  }

  export const test2: number;
}

export {};
