# PharmaQuest RPG

An 8-bit style RPG game for pharmacy students to practice OPRA exam questions.

## Method 1: Running with Visual Studio Code

1. Install Prerequisites:
   - Install [Visual Studio Code](https://code.visualstudio.com/)
   - Install [Python](https://www.python.org/downloads/) (version 3.7 or higher)

2. Download & Setup:
   - Download all the game files
   - Extract them to a folder
   - Open the folder in Visual Studio Code

3. Start the Game:
   - Open a terminal in VSCode (View > Terminal)
   - Run the command: `python3 server.py`
   - Open your web browser and go to: `http://localhost:8000`

## Method 2: Running the Standalone Executable

1. Download the `PharmaQuest.exe` file
2. Double-click to run the game
3. The game will open in your default web browser automatically

## How to Play

1. Use Arrow Keys to move your character (👨‍⚕️)
2. Encounter medicine pills (💊) to start pharmacy battles
3. Answer questions correctly to earn MedCoins and experience
4. Watch your HP - wrong answers will hurt you!
5. Level up to become stronger and earn more rewards

## Files Structure
```
PharmaQuest/
├── index.html           # Main game interface
├── quiz.js             # Game logic
├── server.py           # Local server script
└── Content/
    └── Data/
        └── OPRA2024Questions.json  # Question database
```

## Troubleshooting

1. If port 8000 is already in use:
   - Close other applications that might be using port 8000
   - Or modify the PORT variable in server.py to use a different port

2. If the game doesn't start:
   - Make sure all files are in the correct directory structure
   - Check if Python is installed correctly
   - Ensure all files are downloaded completely

For support, please open an issue on the repository.
