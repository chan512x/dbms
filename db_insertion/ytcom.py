import sys

# Send the string to stdout
string_to_send = "Hello from Python!"
sys.stdout.flush()

# Read the modified string from stdin
modified_string = sys.stdin.readline().strip()
print("Modified string received from JavaScript:", modified_string)
sys.stdout.flush()
