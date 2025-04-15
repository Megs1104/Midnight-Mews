# NC News Seeding
Ensure you have run npm install and npm run setup-dbs prior to setting up the .env files.

To setup the .env files:  

Step 1 - Create a .env.test file and an .env.development file.  
Step 2 - In the .env.test file, add PGDATABASE= nc_news_test so that we can connect to the test database.  
Step 3 - In the .env.development file, add PGDATABASE= nc_news so that we can connect to the development databse.  
Step 4 - Run npm run test-seed and check that the nc_news_test database is logged.  
Step 5 - Run npm run seed-dev and check that the nc_news database is logged.  
