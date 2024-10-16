FROM node:lts-alpine 
WORKDIR /app
ADD package*.json ./
RUN npm install
COPY . /app/
EXPOSE 3000
CMD ["npm","run","dev"]