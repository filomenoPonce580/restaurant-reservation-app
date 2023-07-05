# Table Tracker

App URL: https://table-tracker.onrender.com  

API URL: https://restaurant-reservations-backend-a920.onrender.com

Table Tracker is an application that is designed for restaurant staff. It allows users to manage, create and update reservations.

To get started with this project, follow these steps:

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

If you have trouble getting the server to run, reach out for assistance.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests. You have seen unit and integration tests in previous projects.
End-to-end tests use browser automation to interact with the application just like the user does.
Once the tests are passing for a given user story, you have implemented the necessary functionality.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

- `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
- `npm run test:3:backend` runs only the backend tests for user story 3.
- `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

Since tests take time to run, you might want to consider running only the tests for the user story you're working on at any given time.

Once you have all user stories complete, you can run all the tests using the following commands:

- `npm test` runs _all_ tests.
- `npm run test:backend` runs _all_ backend tests.
- `npm run test:frontend` runs _all_ frontend tests.
- `npm run test:e2e` runs only the end-to-end tests.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.

> **Hint**: If you stop the tests before they finish, it can leave the test database in an unusual state causing the tests to fail unexpectedly the next time you run them. If this happens, delete all tables in the test database, including the `knex_*` tables, and try the tests again.

### Frontend test timeout failure

Running the frontend tests on a resource constrained computer may result in timeout failures.

If you believe your implementation is correct, but needs a bit more time to finish, you can update the `testTimeout` value in `front-end/e2e/jest.config.js`. A value of 10000 or even 12000 will give each test a few more seconds to complete.

#### Screenshots

To help you better understand what might be happening during the end-to-end tests, screenshots are taken at various points in the test.

The screenshots are saved in `front-end/.screenshots` and you can review them after running the end-to-end tests.

You can use the screenshots to debug your code by rendering additional information on the screen.

# Project Takeaways
During the project, I gained several key insights, including:

- User Stories: Understanding how to write user stories and acceptance criteria is crucial for capturing the requirements and expectations of the application from a user's perspective.

- Front-end Development: Implementing the user interface using HTML, CSS, and JavaScript. This includes creating forms, handling user input, displaying error messages, and navigating between pages.

- Back-end Development: Building the server-side logic using a framework like Express.js or similar tools. This involves creating API endpoints, handling HTTP requests and responses, validating user input, and interacting with a database.

- Database Management: Working with a database (such as PostgreSQL) to store and retrieve reservation and table data. This includes designing database schemas, creating tables, seeding initial data, and writing queries to fetch and manipulate data.

- Data Validation: Implementing validation rules to ensure that user input is accurate and meets the specified requirements. This involves checking for constraints like date and time validation, ensuring future reservations, and checking table capacities.

- Error Handling: Handling and displaying error messages to the user in case of validation failures, server errors, or any other unexpected issues that may occur during the application's execution.

- Deployment: Learning how to deploy the application to a hosting platform like Render. This includes configuring the deployment environment, managing dependencies, and ensuring the application is accessible to users.

- Test-Driven Development: Understanding the importance of writing tests for each user story and utilizing them to verify the correctness and functionality of the implemented features.

- Time Management: Prioritizing and ordering the user stories in the product backlog based on their importance and dependencies. This helps in planning and managing the development process effectively.

- Collaboration and Communication: Working collaboratively with the product manager and other team members, understanding their requirements, clarifying any doubts, and providing regular updates on the project's progress.
