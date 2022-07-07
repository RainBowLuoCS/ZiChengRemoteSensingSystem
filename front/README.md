# remote-sensing

2022 中国软件杯 题目 4

# 部署方法

- `git clone` 克隆本项目
- `npm i` 或 `cnpm i` 安装依赖
- `npm run build` 得到打包目录 dist，如果遇到报错信息，定位到报错的那一行代码，在它的上一行加上`/*@ts-ignore*/`，重新打包
- 购买一台服务器，通过 sftp 将打包得到的的 /dist 上传至服务器
- 购买域名，完成域名解析
- ssh 远程连接服务器，安装 nginx，完成 nginx.conf 的配置，最终执行`/usr/local/nginx/sbin/nginx -s reload`
- 访问域名，即可看到网站，部署成功