# How to Run BYAMN Learning Project

## Quick Start (Simplest Method)

### Option 1: Direct Browser Opening
1. Navigate to the project folder: `C:\Users\kurap\Desktop\BYAMN-Learning`
2. Double-click `index.html` to open it in your default browser
3. **Note**: Some features may not work due to browser security restrictions when opening files directly

### Option 2: Using a Local Server (Recommended)

#### Using Python (if installed):
```bash
# Python 3
cd C:\Users\kurap\Desktop\BYAMN-Learning
python -m http.server 8000

# Then open: http://localhost:8000
```

#### Using Node.js (if installed):
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
cd C:\Users\kurap\Desktop\BYAMN-Learning
http-server -p 8000

# Then open: http://localhost:8000
```

#### Using VS Code Live Server Extension:
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Using PHP (if installed):
```bash
cd C:\Users\kurap\Desktop\BYAMN-Learning
php -S localhost:8000
```

## Firebase Setup

The project is already configured with Firebase credentials in `assets/js/firebase.js`. The Firebase project is already set up, so you should be able to use it directly.

## Loading Demo Data

If you see "Error loading courses" on the homepage:

1. Open `load-demo-data.html` in your browser
2. Click the "Load Demo Data" button
3. Wait for the confirmation message
4. Refresh the homepage to see the courses

## Troubleshooting

### CORS Errors
- Always use a local server (Option 2) instead of opening files directly
- This prevents CORS (Cross-Origin Resource Sharing) issues

### Firebase Connection Issues
- Check your internet connection
- Verify Firebase credentials in `assets/js/firebase.js`
- Check browser console (F12) for error messages

### Courses Not Loading
- Make sure you've loaded the demo data (see "Loading Demo Data" above)
- Check browser console for Firebase errors
- Verify Firebase Realtime Database rules allow read access

## Project Structure

- `index.html` - Main homepage
- `courses.html` - Course listing page
- `dashboard.html` - User dashboard
- `auth/login.html` - Login page
- `auth/register.html` - Registration page
- `assets/js/` - JavaScript files
- `assets/css/` - Stylesheet files

## Development Tips

1. **Always use a local server** for development
2. **Check browser console** (F12) for errors
3. **Use browser DevTools** to debug issues
4. **Clear browser cache** if you see old versions


