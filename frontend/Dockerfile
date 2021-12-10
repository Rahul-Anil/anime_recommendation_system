# Node 11.11
FROM node:11.11.0

# LABEL about the custom image
LABEL maintainer="z3417618@ad.unsw.edu.au"
LABEL version="0.1"
LABEL description="This is custom Docker Image for COMP9900 2021 T3 Project"

# Make Directory
RUN mkdir /application
WORKDIR /application

# Copy All Source to 
COPY . /application

# Install Requirements
RUN npm install
RUn npm i styled-components
RUN npm install -g pm2

# Expose Port 3000 (In case)
EXPOSE 3000

# Execution
CMD npm run start
