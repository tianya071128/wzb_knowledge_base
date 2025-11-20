import { Context } from 'koa';

export default function getConfigController(ctx: Context) {
  ctx.success({
    id: '1869274854172147713',
    loginLogo: '',
    welcomeText: '欢迎登录悦文云',
    isRegister: 0,
    pageLogo: '',
    pageName: '悦文云平台',
    thirdAuthConfigs: {
      'wechat-work': {
        agentId: '1000029',
        clientId: 'wwaec78bbec7e04c1a',
      },
    },
    fileChunk: true,
    showDataFactroyState: false,
    loginOutUrl: null,
  });
}
