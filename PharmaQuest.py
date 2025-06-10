import http.server
import socketserver
import webbrowser
import os
import sys
from threading import Timer

PORT = 8000

def open_browser():
    webbrowser.open(f'http://localhost:{PORT}')

Handler = http.server.SimpleHTTPRequestHandler

def run_server():
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Server started at http://localhost:{PORT}")
            print("Game will open in your default browser...")
            Timer(1.5, open_browser).start()
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:  # Port already in use
            print(f"Error: Port {PORT} is already in use.")
            print("Please close any other applications using this port and try again.")
        else:
            print(f"Error: {e}")
        input("Press Enter to exit...")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)

if __name__ == "__main__":
    # Change to the directory containing the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Check if required files exist
    required_files = ['index.html', 'quiz.js', 'Content/Data/OPRA2024Questions.json']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print("Error: The following required files are missing:")
        for file in missing_files:
            print(f"- {file}")
        print("\nPlease make sure all game files are in the correct location.")
        input("Press Enter to exit...")
        sys.exit(1)
    
    print("Starting PharmaQuest RPG...")
    run_server()
