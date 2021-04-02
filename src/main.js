const app = require('./app');
require('./app/database') //加载验证是否链接成功 

const config = require('./app/config')

app.listen(config.APP_PORT, () => {
  console.log(`服务器在${config.APP_PORT}端口启动成功~`);
});
