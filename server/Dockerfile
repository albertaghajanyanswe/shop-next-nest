FROM node:20.11.1

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
COPY package-lock.json ./

# CMD rm -rf node_modules
# CMD ls -l

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm ci --silent
# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 4000

## Launch the wait tool and then your application
# RUN npm prune --production
# CMD npm start
CMD ["npm","run","start:dev"]
