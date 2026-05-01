# Flipop - Memory Card Flip Game

![Flipop Badge](https://img.shields.io/badge/Game-Memory%20Card%20Flip-blue) ![License Badge](https://img.shields.io/badge/License-MIT-green) ![PHP Badge](https://img.shields.io/badge/PHP-7.4%2B-777BB4)

> A dynamic and interactive memory card flip game built with vanilla JavaScript, PHP, and modern web technologies. Challenge yourself or compete with friends in this classic card matching game with multiple difficulty levels, leaderboards, and immersive audio experience.

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Game Modes](#-game-modes)
- [Difficulty Levels](#-difficulty-levels)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Browser Support](#-browser-support)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Gameplay

- **Classic Memory Card Mechanics** - Flip cards to find matching pairs
- **Two Game Modes** - Solo mode and Duel (PvP) mode
- **Three Difficulty Levels** - Easy, Medium, and Hard with varying card counts
- **Real-time Timer** - Track your performance with MM:SS format timer
- **Move Counter** - Monitor the number of moves taken
- **Score System** - Dynamic scoring based on completion time and moves

### Audio Experience

- **Sound Effects** - Card flip sounds, win/lose audio cues
- **Dynamic Background Music** - Different tracks for home screen and gameplay
- **Audio Toggle** - Enable/disable background music with smooth fade transitions
- **Volume Control** - Preset audio levels with customizable settings
- **Persistent Preferences** - Audio settings saved to localStorage

### Visual Features

- **Dark Mode Support** - Full dark theme with smooth transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI** - Clean, intuitive interface with Fredoka and Nunito fonts
- **Color Gradients** - Brand color gradients (Blue to Purple)
- **Shadow Effects** - Depth and elevation with CSS shadows
- **Smooth Animations** - Card flip and transition animations

### Leaderboards & Statistics

- **Solo Leaderboard** - Top 50 scores per difficulty level
- **Duel Leaderboard** - Track head-to-head match results
- **Game History** - Up to 60 recent game results stored in session
- **Performance Metrics** - Score, time, moves, and date tracking
- **Automatic Ranking** - Smart sorting by score, time, and moves

### Data Persistence

- **Session Management** - Server-side session using PHP
- **localStorage Integration** - Client-side preference storage
- **Game History Storage** - Automatic game result recording
- **Leaderboard Caching** - Server-side leaderboard management

## 🎮 Demo

Play the game online: [Flipop Live](https://flipop.vercel.app)

## ⚙️ Requirements

- **PHP** 7.4 or higher (for server deployment)
- **Modern Web Browser** with JavaScript ES6+ support
- **Internet Connection** (for assets and background music)
- **Storage**: Minimal (localStorage for preferences only)

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Installation

### Quick Start (Local Development)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/flipop.git
   cd flipop
   ```

2. **Start a Local PHP Server**

   ```bash
   php -S localhost:8000
   ```

3. **Open in Browser**
   ```
   http://localhost:8000
   ```

### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. The project is pre-configured with `vercel.json` for automatic PHP routing.

## 🎯 Usage

### Starting a Game

1. Open the application in your browser
2. Select your preferred game mode (Solo or Duel)
3. Choose difficulty level:
   - **Easy**: 8 cards (4 pairs)
   - **Medium**: 16 cards (8 pairs)
   - **Hard**: 24 cards (12 pairs)

4. Click or tap cards to flip them
5. Match all pairs to win

### Game Controls

- **Mouse/Tap** - Click cards to flip them
- **Audio Toggle** - Use the music button to enable/disable background music
- **Dark Mode Toggle** - Switch between light and dark themes
- **New Game** - Restart the current session
- **Home** - Return to main menu

## 🎮 Game Modes

### Solo Mode

- **Description**: Challenge yourself to complete the board
- **Scoring**: Points awarded based on completion speed and efficiency
- **Leaderboard**: Personal best scores tracked per difficulty
- **Metrics Tracked**:
  - Total score
  - Completion time (seconds)
  - Number of moves
  - Game date

### Duel Mode (PvP)

- **Description**: Compete against another player or AI
- **Turn-based**: Players take turns flipping cards
- **Winning Condition**: Most matched pairs wins
- **Leaderboard**: Head-to-head match results
- **Winner Margin**: Tracks the score difference between players

## 📊 Difficulty Levels

| Level  | Cards | Pairs | Difficulty   | Best For                        |
| ------ | ----- | ----- | ------------ | ------------------------------- |
| Easy   | 8     | 4     | Beginner     | New players, warm-up            |
| Medium | 16    | 8     | Intermediate | Regular players                 |
| Hard   | 24    | 12    | Advanced     | Experienced players, challenges |

## 🛠 Technologies Used

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Custom properties (CSS variables), Grid, Flexbox, Animations
- **Vanilla JavaScript (ES6+)** - No external dependencies
  - DOM manipulation
  - Event handling
  - localStorage API
  - Audio API

### Fonts

- **Fredoka** - Headings and UI elements
- **Nunito** - Body text
- **Satoshi** - System fallback

### Backend

- **PHP 7.4+** - Server-side logic
- **Session Management** - Game history and leaderboards
- **Vercel** - Deployment platform

### Audio Assets

- Background music tracks
- Card flip sound effects
- Win/lose notifications

## 📁 Project Structure

```
flipop/
├── README.md                 # Documentation
├── vercel.json              # Vercel deployment config
├── api/
│   └── card-system.php      # Backend game logic & leaderboards
├── css/
│   └── style.css            # Styling & animations
├── js/
│   └── script.js            # Game logic & interactions
└── asset/
    ├── img/                 # Card images & UI graphics
    └── sound/
        ├── card-sound-open.mp3      # Card flip open sound
        ├── card-sound-close.mp3     # Card flip close sound
        ├── win.mp3                  # Victory sound effect
        ├── lose.mp3                 # Defeat sound effect
        ├── click.mp3                # UI click sound
        ├── back-sound-home.mp3      # Home screen music
        └── back-sound-game.mp3      # Gameplay music
```

## ⚙️ Configuration

### Audio Configuration

Located in `js/script.js`:

```javascript
const bgMusic = {
  home: new Audio("../asset/sound/back-sound-home.mp3"),
  game: new Audio("../asset/sound/back-sound-game.mp3"),
  enabled: true,
  fadeDuration: 1000, // Fade transition in milliseconds
};

// Volume Settings
audio.volume = 0.3; // 30% default volume
```

### Session Configuration

Located in `api/card-system.php`:

```php
// Session storage structure
$_SESSION['history'] = []; // Up to 60 game records
$_SESSION['leaderboard'] = [
  'solo' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
  'duel' => ['mudah'=>[], 'sedang'=>[], 'sulit'=>[]],
];
```

### Color Scheme

The application uses CSS custom properties for theming:

```css
:root {
  /* Light Theme */
  --brand-grad1: #2563eb; /* Blue */
  --brand-grad2: #7c3aed; /* Purple */
  --success: #34d399; /* Green */
  --card-back1: #60a5fa; /* Light Blue */
  --card-back2: #a78bfa; /* Light Purple */
}

:root.dark {
  /* Dark Theme */
  --brand-grad1: #4f46e5; /* Indigo */
  --brand-grad2: #a855f7; /* Fuchsia */
  /* ... */
}
```

## 🌐 Browser Support

| Browser       | Support          | Minimum Version |
| ------------- | ---------------- | --------------- |
| Chrome        | ✅ Full          | 90+             |
| Firefox       | ✅ Full          | 88+             |
| Safari        | ✅ Full          | 14+             |
| Edge          | ✅ Full          | 90+             |
| iOS Safari    | ✅ Full          | 14+             |
| Chrome Mobile | ✅ Full          | 90+             |
| IE 11         | ❌ Not Supported | -               |

## ⚡ Performance

### Optimization Features

- **Vanilla JavaScript** - No framework overhead
- **Minimal Dependencies** - Only native browser APIs
- **Efficient DOM Manipulation** - Minimal reflows/repaints
- **Optimized Audio** - Fade transitions instead of sudden stops
- **localStorage Caching** - Fast preference loading

### Load Times

- **Initial Load**: ~500ms (with assets)
- **Game Start**: ~100ms
- **Card Flip Animation**: 400ms

### Bundle Size

- **HTML**: <50KB
- **CSS**: ~30KB
- **JavaScript**: ~40KB
- **Total**: <120KB (uncompressed)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Test across different browsers
- Update documentation as needed
- Keep commits atomic and descriptive

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Free to Use For:

- ✅ Personal projects
- ✅ Educational purposes
- ✅ Commercial projects (with attribution)
- ✅ Modifications and distributions

## 📧 Support & Contact

For issues, questions, or suggestions:

- **GitHub Issues**: [Report a bug](https://github.com/yourusername/flipop/issues)
- **Discussions**: [Join community discussions](https://github.com/yourusername/flipop/discussions)
- **Email**: your-email@example.com

## 🎉 Credits

- **Game Design**: Memory Card Flip Game Classic
- **Font**: Fredoka, Nunito, Satoshi
- **Audio Design**: Sound effects and background music
- **Platform**: Deployed on Vercel

---

**Made with ❤️ by [Your Name]**

Last Updated: May 2026
