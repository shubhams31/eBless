# eBlessings - Anniversary Message Recording Website

A beautiful and modern web application for recording and managing anniversary video and audio messages for your parents.

## Features

### For Users (Public Access)
- **Simple Recording Interface**: One-click video and audio recording
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Real-time Preview**: See and hear your recordings before submitting
- **Easy Submission**: Simple form with name and message fields
- **Mobile Friendly**: Works perfectly on all devices

### For Admin (Password Protected)
- **View All Messages**: Browse through all recorded messages
- **Search & Filter**: Find specific messages by name, content, or type
- **Download Messages**: Download video and audio files
- **Delete Messages**: Remove unwanted recordings
- **Statistics Dashboard**: View message counts and analytics
- **Secure Access**: Password-protected admin panel

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Styled Components
- **Icons**: React Icons
- **Routing**: React Router DOM
- **Media Recording**: Web APIs (MediaRecorder, getUserMedia)
- **Build Tool**: Create React App

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd eBlessings
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to `http://localhost:3000`

## Usage

### Recording Messages
1. Visit the homepage
2. Choose between Video or Audio recording
3. Fill in your name and message
4. Click "Start Recording" and speak/record your message
5. Click "Stop Recording" when done
6. Preview your recording
7. Click "Submit Message" to save

### Admin Access
1. Click "Admin" in the navigation
2. Enter the password: `parents2024`
3. Access the admin panel to view, download, and manage messages

## Project Structure

```
eBlessings/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation header
│   │   ├── RecordingPage.js   # Main recording interface
│   │   ├── VideoRecorder.js   # Video recording component
│   │   ├── AudioRecorder.js   # Audio recording component
│   │   ├── AdminPage.js       # Admin dashboard
│   │   └── LoginPage.js       # Admin login
│   ├── App.js                 # Main app component
│   ├── index.js              # App entry point
│   └── index.css             # Global styles
├── package.json
└── README.md
```

## Security Features

- **Admin Authentication**: Simple password-based authentication
- **Session Management**: Uses localStorage for session persistence
- **Access Control**: Admin features are only available after login

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Push your code to GitHub
2. Connect your repository to Netlify or Vercel
3. Set build command: `npm run build`
4. Set publish directory: `build`

## Customization

### Changing Admin Password
Edit the password in `src/App.js`:
```javascript
const handleLogin = (password) => {
  if (password === 'your-new-password') {
    // ... rest of the code
  }
};
```

### Styling
- Global styles are in `src/index.css`
- Component-specific styles use Styled Components
- Color scheme can be modified in the CSS variables

### Adding Features
- Backend integration for persistent storage
- Email notifications
- Social sharing
- Custom branding

## Troubleshooting

### Camera/Microphone Access
- Ensure your browser has permission to access camera/microphone
- Try refreshing the page if permissions are denied
- Check that you're using HTTPS (required for media access)

### Recording Issues
- Make sure you have a working camera/microphone
- Try a different browser if issues persist
- Check browser console for error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for special anniversary celebrations** 