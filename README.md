# Graphene
>Graphene是一个可视化WEB端工具，主要做属性图数据建模、图结构设计！

## 谁可以使用它？
>图数据工程师、算法工程师、数据内容工程师，其它需要用图的思维模式来做事情的小伙伴！

## 核心功能
1. 图结构与属性图设计
2. 图数据模型上传下载与导出
3. 图数据模型协作与分享
4. 数据任务ID生成
5. GraphQL/Cypher/Javascript等查询或接口代码的自动生成

## Introduction
>[图数据模型设计工具](https://ongdb-contrib.github.io/graphene/demo.html)

![intro-1](images/intro-1.jpg)
![intro-2](images/intro-2.jpg)
![intro-3](images/intro-3.jpg)
![intro-4](images/intro-4.jpg)
![intro-5](images/intro-5.jpg)

- 测试用管理员秘钥
```
a399f5a3-8751-491a-bd69-be7c94ec39e2
```

## 部署环境
```
unzip -d ./graphene/ graphene.zip
```
1. git clone https://github.com/ongdb-contrib/graphene.git
2. cd graphene
3. npm install
4. npm start
5. open http://localhost:8080/app/
```
其它信息
Version: webpack 1.15.0
v14.16.1
```

### Dockerfile
- 在graphene目录下创建Dockerfile文件，打包前端docker镜像即可
```
FROM centos
USER root
WORKDIR /app
ADD . /app/
RUN yum install -y npm maven
RUN npm install -g cnpm -registry=https://registry.npm.taobao.org
RUN npm install webpack@4.46.0 webpack-cli@3.3.12 webpack-dev-server@3.11.0 -g
RUN cnpm install clean-webpack-plugin@3.0.0 \
                 css-loader@3.6.0 \
                 file-loader@6.0.0 \
                 html-loader@1.1.0 \
                 html-webpack-harddisk-plugin@1.0.2 \
                 html-webpack-plugin@4.5.2 \
                 mini-css-extract-plugin@0.9.0 \
                 node-sass@4.14.1 \
                 optimize-css-assets-webpack-plugin@5.0.3 \
                 sass-loader@9.0.2 \
                 style-loader@1.2.1 \
                 url-loader@4.1.0 \
                 copy-webpack-plugin@6.2.1 \
                 glob@7.1.6 jquery@3.5.1
WORKDIR /app/browser
#CMD ["cnpm","install"]
#ENTRYPOINT ["cnpm", "start"]
```
- 打包
```
sudo docker build -t graphene:v-1.0.0 .
```
- 启动
```
sudo docker run -p 8080:8080 graphene:v-1.0.0 bash -c "cnpm install && cnpm start"
```
- DockerHub运行
```
docker run -it -p 3000:3000 grapher01110/graphene:main-2022-02-14-17-11-54
http://localhost:3000/
```
