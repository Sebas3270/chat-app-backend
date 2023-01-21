<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Chat App Backend

The backend (made with NestJs) of the Chat App Project to improve my mobile and backend development knowledge, in this backend you are going to find authentication methods, jwt validations, mongodb connection, web sockets to make the real time chat communication, and more.

You can see the [Mobile App](https://github.com/Sebas3270/chat-app) to see the implementation of this backend.

## Installation

1. Clone project
2. Install dependencies
```
npm install
```
3. Clone ```.env.template``` file and rename it to ```.env```
4. Create a [Cloudinary](https://cloudinary.com/) account to have a media management for the profile picture of the users
5. Create a folder in your Cloudinary Media Library called ```chat_app```
6. Change requested env variables
7. Set up mongo database
```
docker-compose up -d
```
8. Run the project
```
npm run start:dev
```