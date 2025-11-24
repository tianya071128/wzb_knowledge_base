import { Context } from 'koa';

export default function getLoginUserInfoController(ctx: Context) {
  ctx.error('暂不支持获取登录用户信息');
  // ctx.success({
  //   id: 1,
  //   username: 'admin',
  //   mobile: '12345678901',
  //   email: '<EMAIL>',
  //   avatar: 'https://avatar.com/avatar.png',
  //   nickname: '管理员',
  //   status: 1,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // });
}
