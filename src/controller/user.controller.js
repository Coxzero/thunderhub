const fs = require('fs');

const service = require('../service/user.service');
const fileService = require('../service/file.service');
const { AVATAR_PATH } = require('../constants/file-path');

class UserController {
  async create(ctx, next) {
    //获取用户请求传递参数
    const user = ctx.request.body;

    //查询数据 抽取出单独模块
    const result = await service.create(user);

    //返回数据
    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    /* 
      下载
    */
    //用户头像是哪一个文件夹
    /* 
    const { userId } = ctx.params;

    const avatarInfo = await fileService.getAvatarByUserId(userId);
    console.log(avatarInfo);
    //提供图像信息
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
     */

    /* 
      浏览
    */
      const { userId } = ctx.params;

      const avatarInfo = await fileService.getAvatarByUserId(userId);
    
      //提供图像信息 
      ctx.response.set('content-type',avatarInfo.mimetype) //设置为图片格式
      ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);

  }
}
module.exports = new UserController();
