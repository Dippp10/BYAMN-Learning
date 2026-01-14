
# BYAMN Learning Platform

Transform YouTube learning into verified achievement with free
certificates. Track progress, earn credentials, and advance your career
with 200+ expert-led courses.

## About

BYAMN (Build Your Academic Mind Network) is an innovative learning
platform that transforms YouTube content into structured, certifiable
educational experiences. Our platform allows users to enroll in courses
based on YouTube playlists, track their progress, and earn verified
certificates upon completion.

## Features

-   **Course Enrollment**: Browse and enroll in 200+ expert-led courses
-   **Progress Tracking**: Monitor your learning journey with detailed
    progress indicators
-   **Verified Certificates**: Earn authenticated certificates upon
    course completion
-   **Mobile Responsive**: Access learning content on any device
-   **User Dashboard**: Personalized dashboard to track enrolled courses
    and progress
-   **Secure Authentication**: Firebase-based authentication system

## Technologies Used

-   **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
-   **Backend**: Firebase (Authentication, Firestore, Realtime Database)
-   **Deployment**: Vercel
-   **Additional Libraries**:
    -   jsPDF for certificate generation
    -   html2canvas for certificate design capture

## Getting Started

-   Read First This Then Start
    **https://github.com/DYHARDx/BYAMN-Learning/issues/3#issue-3567237056**

### 📹 Getting Started Video Resources

#### For Contributors

-   How to Fork and Clone a GitHub Repository:
    https://www.youtube.com/watch?v=OODDLyvePr8
-   How to Create Your First Pull Request on GitHub:
    https://www.youtube.com/watch?v=nCKdihvneS0
-   Git & GitHub for Beginners -- Full Course:
    https://www.youtube.com/watch?v=Ez8F0nW6S-w&t=2196s

#### For Mentors

-   How to Review Pull Requests on GitHub:
    https://www.youtube.com/watch?v=lSnbOtw4izI
-   GitHub Issues Tutorial: https://www.youtube.com/watch?v=TKJ4RdhyB5Y

### Prerequisites

-   A modern web browser (Chrome, Firefox, Safari, or Edge)
-   Internet connection

### Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/your-username/byamn-learning.git
    ```

2.  Navigate to the project directory:

    ``` bash
    cd byamn-learning
    ```

3.  Open `index.html` in your web browser or deploy to a web server

### Firebase Configuration

The application uses Firebase for authentication and data storage. To
configure your own Firebase project:

1.  Create a Firebase project at https://console.firebase.google.com/
2.  Register your web app in Firebase
3.  Update the Firebase configuration in `assets/js/firebase.js` with
    your project credentials

### Loading Demo Data

If you see "Error loading courses" on the homepage, you need to load the demo data:

1. Open `load-demo-data.html` in your browser
2. Click the "Load Demo Data" button
3. Refresh the homepage to see the courses

For more details, see `README-FIX.md`.

## Project Structure

    BYAMN-Learning/
    ├── assets/
    │   ├── css/
    │   │   └── styles.css
    │   └── js/
    │       ├── auth.js
    │       ├── certificate.js
    │       ├── course-player.js
    │       ├── courses.js
    │       ├── dashboard.js
    │       ├── firebase.js
    │       ├── main.js
    │       ├── student-courses.js
    │       └── verification.js
    ├── auth/
    │   ├── login.html
    │   └── register.html
    ├── about.html
    ├── certificate.html
    ├── contact.html
    ├── courses.html
    ├── dashboard.html
    ├── faq.html
    ├── index.html
    ├── player.html
    ├── privacy.html
    ├── student-courses.html
    ├── terms.html
    └── verification.html

## Contributing

We welcome contributions to improve the BYAMN Learning Platform. To
contribute:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## ✨ Contributors

Thanks to all the wonderful contributors who help make BYAMN Learning better every day! 💖

<a href="https://github.com/DYHARDx/BYAMN-Learning/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DYHARDx/BYAMN-Learning" />
</a>

You can explore contribution history here:  
**[View Contribution Graph](https://github.com/DYHARDx/BYAMN-Learning/graphs/contributors)**


## License

### 📄 License Overview

This project is licensed under the **MIT License**, a permissive open-source license that allows flexibility for use, modification, and distribution. See the full text in the [`LICENSE`](LICENSE) file for complete legal terms.  

This section summarizes the key points of the MIT License to make it easier for users and contributors to understand their rights and obligations. :contentReference[oaicite:1]{index=1}

---

### ⚖️ Permissions

Under the MIT License, you *are permitted* to:

- **Use** the software for any purpose.
- **Copy** and share the software with others.
- **Modify** the source code to suit your needs.
- **Distribute** original or modified versions of the software.
- **Commercially use** or integrate it into proprietary products. :contentReference[oaicite:2]{index=2}

---

### 📌 Conditions

The MIT License requires that:

- The original **copyright notice** and **license text** be included in all copies or substantial portions of the software.
- You must provide appropriate credit to the original authors when redistributing. :contentReference[oaicite:3]{index=3}

---

### 🚫 Limitations

The MIT License *limits liability* by stating:

- The software is provided **“as is”**, without warranty of any kind.
- The authors or copyright holders are **not liable** for any claims, damages, or other liabilities arising from the use of the software. :contentReference[oaicite:4]{index=4}

---

### 📎 Reference

For the full legal text of the license, see the project’s [`LICENSE`](LICENSE) file in this repository.



## Contact

For support or inquiries, please contact us through our Contact Page or
open an issue on GitHub.

## Acknowledgments

-   Thanks to all YouTube content creators whose educational content
    inspired this platform
-   Firebase for providing a robust backend infrastructure
-   Tailwind CSS for the utility-first CSS framework
