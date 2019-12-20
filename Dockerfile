FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm install

# RUN npm install sucrase -g
# RUN sucrase ./src -d ./dist --transforms javascript,imports

EXPOSE 3000

# RUN npm run build
# RUN npm install pm2 -g
# RUN npm install nodemon sequelize-cli -g

# CMD ["nodemon", "./src/server.js"]
# CMD sequelize db:migrate && sequelize db:seed:all && nodemon src/server.js & nodemon src/queue.js
# CMD npm run db:migrate && npm run dev
# CMD ["pm2-runtime", "./dist/server.js"]
