const fs = require('fs');

const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');
const { PICTURE_PATH } = require('../constants/file-path');

class MomentController {
  async create(ctx, next) {
    //1. 获取我们的数据（user_id content,picture）
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    //2.将数据插入到数据库中
    const result = await momentService.create(userId, content);
    ctx.body = result;
  }

  async detail(ctx, next) {
    //获取momentid
    const momentId = ctx.params.momentId;

    //根据 id去查询这条数据
    const result = await momentService.getMomentById(momentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    const { offset, size } = ctx.query;

    //2查询我们的列表
    const result = await momentService.getMomentList(offset, size);

    ctx.body = result;
  }
  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    //修改内容
    const result = await momentService.update(content, momentId);
    ctx.body = result;
  }
  async remove(ctx, next) {
    //获取moment——id
    const { momentId } = ctx.params;

    //删除内容
    const result = await momentService.remove(momentId);
    ctx.body = result;
  }
  async addLabels(ctx, next) {
    //1.获取标签和动态ID
    const { labels } = ctx;
    const { momentId } = ctx.params;
    //2.添加所有的标签
    for (const label of labels) {
      //判断标签是否和标签有过标签
      const isExist = await momentService.hasLabel(momentId, label.id);
      if (!isExist) {
        momentService.addLabel(momentId, label.id);
      }
    }

    ctx.body = '添加标签成功~';
  }
  async fileInfo(ctx, next) {
    const { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);

    const { type } = ctx.query;
    const types = ['small', 'middle', 'large'];
    if (types.some((item) => item === type)) {
      filename = filename + '-' + type;
    }
    ctx.response.set('content-type', fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);

    //新的需求返回图片的大小
  }
}

module.exports = new MomentController();
