FROM node:14.15.1-stretch
ENV NODE_ENV development
# Add a work directory
WORKDIR /graphene
# Cache and Install dependencies
COPY . .
RUN chmod +777 ./node_modules/.bin/webpack
RUN chmod +777 ./node_modules/.bin/webpack-dev-server
#COPY package.json .
RUN npm install
RUN npm run-script build
# Copy app files
# Expose port
EXPOSE 8080
# Start the app
CMD [ "npm", "start" ]

