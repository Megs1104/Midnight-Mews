# Midnight Mews

> Live demo: https://megs-news-app.onrender.com/api
<hr>
A back-end web application that allows users to view news articles, comment and manage existing comments. Built with Node.js, Express and PostgreSQL. Development tools used include Jest, Supertest, jest-sorted and dotenv.

## Getting Started:

Ensure you have the following installed on your machine:

Node.js (version 23.11.0 or higher)

PostgreSQL (version 8.15.6 or higher)

npm (version 11.3.0 or higher)

## Installation:

1. Clone this repository.
2. Install dependencies using npm install.
3. Run npm setup-dbs to setup the database.
4. Create a .env.test file and an .env.development file.
5. In the .env.test file, add PGDATABASE= nc_news_test so that we can connect to the test database. 
5. In the .env.development file, add PGDATABASE= nc_news so that we can connect to the development databse.
6. Run npm run test-seed and check that the nc_news_test database is logged.
7. Run npm run seed-dev and check that the nc_news database is logged.
8. Run tests using npm test.

Thanks for looking! 

