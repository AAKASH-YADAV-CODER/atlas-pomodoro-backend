# Atlas Pomodoro

A modern Pomodoro timer application built with React and Node.js to help you stay focused and productive.

![Atlas Pomodoro](https://github.com/AAKASH-YADAV-CODER/atlas-pomodoro-frontend/raw/main/public/atlas-logo.png)

# Answering Question by Atlas Guid.

## What was the hardest part to build? How did you approach it?

The most challenging part was managing the timer logic and ensuring it stayed accurate and consistent across different states—active, paused, and resumed.

## What tradeoffs did you make and why?

One tradeoff I made was simplifying the UI interactions to focus more on core functionality like notification using socket.io. While a more interactive UI (animations or sound cues) would enhance UX, I prioritized stability and time-based logic within the deadline.

## If you had 2 more hours, what would you improve?

I’d focus on adding coupons part like for particular point i'll provide coupons to user. also adding notification if task have deadline less than 5 minute then notification needed to send user.

## If you used AI tools (e.g., ChatGPT, Copilot), explain how you used them and why.What decisions did you make beyond the suggestions?

Yes, I used ChatGPT to get guidance on structuring the timer logic cleanly and to troubleshoot a few state management issues. I also used Copilot for boilerplate generation. However, I made critical decisions myself regarding state structure, UX flow, and how to handle edge cases like browser tab switching and pause/resume behavior—focusing on code readability and maintainability beyond the AI suggestions.

## About the Project

Atlas Pomodoro is a productivity application that helps you manage your time using the Pomodoro Technique. It features a beautiful, intuitive interface and provides tools to track your productivity, manage tasks, and earn rewards for staying focused.

### What is the Pomodoro Technique?

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a "pomodoro," from the Italian word for tomato (after the tomato-shaped kitchen timer Cirillo used as a university student).

Benefits of the Pomodoro Technique:

- Reduces mental fatigue
- Improves focus and concentration
- Helps maintain high productivity throughout the day
- Provides a sense of accomplishment
- Creates a sustainable work rhythm

## Features

- **Customizable Timer**: Set your own work and break durations
- **Task Management**: Create, track, and complete tasks
- **User Authentication**: Secure signup and login
- **Progress Tracking**: Monitor your productivity over time
- **Reward System**: Earn points and coins for completing tasks
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React.js
- Redux for state management
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend

- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or pnpm
- MongoDB (local or Atlas)

### Frontend Setup

1. Clone the repository

```bash
git clone https://github.com/AAKASH-YADAV-CODER/atlas-pomodoro-frontend.git
cd atlas-pomodoro-frontend
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:3000
```

4. Start the development server

```bash
npm run dev
# or
pnpm dev
```

### Backend Setup

1. Clone the repository

```bash
git clone https://github.com/AAKASH-YADAV-CODER/atlas-pomodoro-backend.git
cd atlas-pomodoro-backend
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the server

```bash
npm run server
# or
pnpm server
```

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account
3. **Create Tasks**: Add tasks you want to complete
4. **Start Timer**: Begin a Pomodoro session
5. **Take Breaks**: Follow the timer for work and break periods
6. **Complete Tasks**: Mark tasks as complete to earn points
7. **Track Progress**: View your productivity statistics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Aakash Yadav - [GitHub](https://github.com/AAKASH-YADAV-CODER)

Project Link: [https://github.com/AAKASH-YADAV-CODER/atlas-pomodoro-frontend](https://github.com/AAKASH-YADAV-CODER/atlas-pomodoro-frontend)

## Acknowledgments

- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) by Francesco Cirillo
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
