FROM node:alpine
WORKDIR '/app'

COPY package.json ./
COPY ./build ./build
RUN npm install --legacy-peer-deps
RUN npm install serve
CMD ["npx","serve","-p","80","build"]
# CMD ["npm","run","mac"]