# calendar-rest-api

REST API and App were developed by using React for the frontend, and Node.js, Express.js and MongoDB for the backend.

1. Run npm install
2. Create .env file in project root folder with MONGODB_URI, TEST_MONGODB_URI and PORT environment variables specified.
3. If you are using Windows OS, prefix package.json scripts with cross-env.
4. Use the commands specified in package.json to run the program or tests.

### Routes

- app: /
- events API: /api/events
- invalid: 404

### Queries

- name: filter by name (event name contains the parameter)
- day: filter by day
- month: filter by month
- year: filter by year
- time: filter by time HH:mm
- sorted: sort by date

System: Ubuntu, Modified: 29.04.2019 06:57
