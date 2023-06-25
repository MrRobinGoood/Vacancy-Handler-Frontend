FROM node:18.16.1-slim
WORKDIR /app
COPY package.json /app/package.json
COPY src /app/src
COPY public /app/public
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]