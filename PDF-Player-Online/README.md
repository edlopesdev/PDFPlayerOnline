# PDF Player Online

PDF Player Online is a web application that allows users to read PDF files aloud using Text-to-Speech technology. The application features a user-friendly player interface, progress resumption, advertising and premium options, and a dark mode for enhanced usability.

## Features

- **Text-to-Speech**: Read PDF files aloud using the Web Speech API.
- **Player Interface**: Intuitive controls for play, pause, and resume functionality.
- **Progress Resumption**: Automatically saves and retrieves reading progress using localStorage.
- **Advertising Options**: Displays ads for non-premium users with the ability to skip for premium members.
- **Premium Subscription**: Offers premium features and ad-free experience through subscription.
- **Dark Mode**: Aesthetic dark mode for comfortable reading in low-light environments.

## Project Structure

```
PDF-Player-Online
├── src
│   ├── index.html
│   ├── styles
│   │   └── tailwind.css
│   ├── js
│   │   ├── app.js
│   │   ├── tts.js
│   │   ├── player.js
│   │   ├── progress.js
│   │   ├── ads.js
│   │   └── premium.js
│   └── assets
│       └── fonts
│           └── .gitkeep
├── tailwind.config.js
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/PDF-Player-Online.git
   ```
2. Navigate to the project directory:
   ```
   cd PDF-Player-Online
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in your web browser.
2. Upload a PDF file using the provided button.
3. Use the player controls to start reading the PDF aloud.
4. Enjoy the ad-free experience by subscribing to the premium option.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.