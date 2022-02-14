#FROM centos
#USER root
#WORKDIR /app
#ADD . /app/
#RUN yum install -y npm maven
#RUN npm install -g cnpm -registry=https://registry.npm.taobao.org
#RUN npm install webpack@4.46.0 webpack-cli@3.3.12 webpack-dev-server@3.11.0 -g
#RUN cnpm install clean-webpack-plugin@3.0.0 \
#                 css-loader@3.6.0 \
#                 file-loader@6.0.0 \
#                 html-loader@1.1.0 \
#                 html-webpack-harddisk-plugin@1.0.2 \
#                 html-webpack-plugin@4.5.2 \
#                 mini-css-extract-plugin@0.9.0 \
#                 node-sass@4.14.1 \
#                 optimize-css-assets-webpack-plugin@5.0.3 \
#                 sass-loader@9.0.2 \
#                 style-loader@1.2.1 \
#                 url-loader@4.1.0 \
#                 copy-webpack-plugin@6.2.1 \
#                 glob@7.1.6 jquery@3.5.1
#WORKDIR /app
#CMD ["cnpm","install"]
#ENTRYPOINT ["cnpm", "start"]


FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]

