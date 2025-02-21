# Quiz App

## Features

- **Interactive Quiz**: Users can answer multiple-choice questions with real-time feedback.
- **Timer Functionality**: Each question is timed, and unanswered questions are marked automatically.
- **State Persistence**: Quiz progress is saved even if the page is reloaded.
- **Quiz History Management**: Stores past attempts using IndexedDB.
- **Automatic Cleanup**: After 20 attempts, the oldest 10 are deleted.
- **Results Page**: Displays the final score and allows users to restart the quiz.

##  How to Run the App Locally

### **Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### **Installation & Setup**

1. **Clone the Repository**

```sh
 git clone https://github.com/your-username/quiz-app.git
 cd quiz-app
```

2. **Install Dependencies**

```sh
 npm install
```

3. **Start the Development Server**

```sh
 npm run dev
```

4. **Open in Browser** Navigate to `http://localhost:5173` (if using Vite) to access the quiz app.


## 🌍 Live Demo

[Click here to visit the deployed app](https://ddquizapp.netlify.app/)




