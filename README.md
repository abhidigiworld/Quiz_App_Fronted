Quiz App
Overview
The Quiz App is a web-based platform that allows users to take multiple-choice question (MCQ) tests. The app provides functionality for both administrators and students. Administrators can create, delete, and manage tests, while students can attempt tests, view their scores, and receive their results . The app is built using React for the frontend, Node.js for the backend, and MongoDB for the database.

Features
Admin Features
Create Tests: Administrators can create MCQ tests with a specified number of questions, options, correct answers, and expiration time.
Manage Tests: Administrators can update and delete tests, with confirmation prompts before proceeding.
View User Results: Administrators can view the results of users who have attempted the tests.
Student Features
Attempt Tests: Students can attempt tests, with camera and audio permissions required for starting the test.
View Attempted Tests: Students can view the list of tests they have attempted along with their scores.
Receive Results: Students will receive their test scores.
Additional Features
Camera and Audio Permissions: Tests require camera and audio permissions. If the user denies permission, the test will not be shown.
Real-time Score Calculation: Scores are calculated and stored in real-time after the test submission.
JWT Authentication: User authentication is handled using JWT tokens stored as cookies.
Technologies Used
Frontend: React, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Installation
Prerequisites
Node.js
MongoDB
Steps to Install and Run the Project
Clone the Repository:

bash
git clone https://github.com/abhidigiworld/quiz-app.git
cd quiz-app
Install Backend Dependencies:

bash
cd backend
npm install
Install Frontend Dependencies:

bash
cd ../frontend
npm install
Set Up Environment Variables:
Create a .env file in the backend directory and add the following environment variables:

plaintext
Copy code
MONGODB_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret>
Run the Backend:

bash
Copy code
cd backend
npm start
Run the Frontend:

bash
Copy code
cd ../frontend
npm start
Access the Application:
Open your browser and navigate to http://localhost:5173 or the fornted page where it run to access the Quiz App.

Usage
Admin Usage
Login as Admin: Use your credentials to log in as an admin.
Create a Test: Navigate to the admin page and create a new test by specifying the test name, questions, options, correct answers, and expiry time.
Manage Tests: Delete tests as needed, with confirmation prompts for safety.
View Results: Access user results to see the scores of attempted tests.
Student Usage
Sign Up/Log In: Sign up or log in using your credentials.
Attempt Tests: Select a test from the available list and complete it within the given time.
View Attempted Tests: Check your previous test attempts and scores on the student dashboard.
Receive Scores via Email: After completing a test, you'll receive your score.
Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request. Contributions are welcome!

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contact
For any questions or feedback, feel free to reach out at abhishekvishwakarma460@gmail.com