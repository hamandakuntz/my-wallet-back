# My Wallet <img src='https://user-images.githubusercontent.com/77818350/128784460-9f8af031-2cf4-4f3a-a59e-98b77c9939c1.png' width="30" height="30">

An easy to use financial manager. Track your revenues and expenses to learn how you spend your money and know all the time how much you have.

## About

This is an web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign Up
- Login
- List all financial events for a user
- Add expense
- Add revenue
- Check your balance
- Logout

By using this app any user can learn how they've been using their money and always keep track of your balance.

This is a demo of the application running: 

![mywallet](https://user-images.githubusercontent.com/77818350/130640046-68a1c93c-ec77-4991-91e9-33a7d6842975.gif)

You also can test this app here: https://my-wallet-front-hamandakuntz.vercel.app/

## Technologies
The following tools and frameworks I used in the construction of the project:<br>
<p>
  <img style='margin: 5px;' src='https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white'>
  <img style='margin: 5px;' src='https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white'>
  <img style='margin: 5px;' src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
  <img style='margin: 5px;' src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>
</p>

## New feats to add soon:

- Delete an expense/revenue
- Refactor the code to use the concept of layered architecture

## How to run

1. Clone this repository
2. Clone the front-end repository at https://github.com/hamandakuntz/my-wallet-front
3. Follow instructions to run front-end at https://github.com/hamandakuntz/my-wallet-front

4. Create a database (you can find the ``dump.sql`` file at ``database`` paste in this repository):
  4.1 Open your terminal in the same path as the ``dump.sql`` file is.
  4.2 Use the command ``sudo su postgres``, enter your password to connect with PostgreSQL and then, type ``psql postgres`` and click enter.
  4.3 Use the command ``CREATE DATABASE mywallet`` to create a database and then click enter.
  4.4 Type \q and hit enter again.
  4.5 Finally, use the command ``psql mywallet < dump.sql``. This way your database will be ready. 
  
5. Now we need to set the environment variables:
  5.1 Create a ``.env`` file in the folder root
  5.2 Use the ``.env.example`` as a model
  5.3 Alter the DATABASE_URL to this format: ``"postgres://user:password@host:port/mywallet"``
  5.4 Set the ``PORT`` to 4000
  
6. Install all dependencies
```bash
npm i
```
7. Run the back-end with
```bash
npm start
```
8. You can optionally build the project running
```bash
npm run build
```

9. To run the tests use 
```bash
npm run test
```

10. Finally the server will be listening in http://localhost:4000
