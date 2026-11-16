# 🎬 Movie Search App

A responsive web application to search for movies and TV shows using the TVmaze API.

## 🚀 Features
* **Real-time Search:** Search for any movie or TV show.
* **Error Handling:** Comprehensive handling for Offline mode, Network Errors, and Timeout.
* **Loading States:** Visual feedback with loading spinners while fetching data.
* **Responsive Design:** Looks good on both desktop and mobile devices.
* **Security:** Implemented HTML escaping to prevent XSS (Cross-Site Scripting) attacks from API data.

## 🛠️ Technologies Used
* HTML5
* CSS3 (CSS Grid, Flexbox, Animations)
* Vanilla JavaScript (ES6+, Async/Await, Fetch API, AbortController)

## 🧠 What I Learned & Refactoring Process
This project was a great learning experience in debugging and code refactoring. Initially, the app faced issues with continuous loading and crashing. Here is what I improved:
1. **Fixed Syntax Errors:** Corrected nested try-catch blocks and unclosed template literals.
2. **DOM Safety:** Added optional chaining (`?.`) and null checks to prevent the app from crashing if an HTML element is missing.
3. **Proper Error Handling:** Implemented `AbortController` to handle request timeouts and distinguish between offline and network errors.
4. **UI/UX Fixes:** Fixed CSS `[hidden]` attribute conflicts to ensure loaders disappear correctly after data is fetched.

## 💻 How to Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/username-kamu/nama-repo-kamu.git