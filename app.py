#pip install Flask Flask-CORS google-generativeai python-dotenv

import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for requests from your React app's origin (e.g., http://localhost:3000)
# Adjust origins=['*'] for production to be more specific
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# Configure the Gemini client
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=api_key)

# Choose the model - adjust if needed
# Consider using "gemini-1.5-flash" for potentially faster/cheaper responses if suitable
model = genai.GenerativeModel('gemini-1.5-flash') 

# --- Guardrail Prompt ---
# This instructs the AI on its role and limitations
SYSTEM_INSTRUCTION = """
You are FarmWise AI, a specialized assistant focused exclusively on farming, agriculture, horticulture, crop management, soil science, pest control, irrigation, livestock (related to farming operations), and sustainable farming practices.

Your tasks are:
1. Answer user questions accurately and helpfully *only if they fall within the farming-related topics* listed above.
2. If a user asks a question *outside* of these topics (e.g., about politics, celebrities, coding, general knowledge unrelated to farming), you MUST politely decline. State clearly that you can only assist with farming-related inquiries. Do not attempt to answer off-topic questions.
3. Keep your answers concise and practical for a farmer or gardener.
4. Do not engage in harmful, unethical, or inappropriate discussions.
"""

@app.route('/api/chat', methods=['POST'])
def chat_handler():
    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # --- Construct the prompt for Gemini ---
        # Combine the system instruction with the user's message
        # Using a multi-turn structure can sometimes yield better adherence to instructions
        chat_session = model.start_chat(history=[
             {
                "role": "user",
                "parts": [SYSTEM_INSTRUCTION] # Prime the AI with its instructions
             },
             {
                 "role": "model",
                 "parts": ["Understood. I am FarmWise AI, ready to answer your farming-related questions. How can I help you today?"] # Simulate AI acknowledging instructions
             }
        ])

        # Send the actual user message
        response = chat_session.send_message(user_message)

        ai_response_text = response.text

        return jsonify({"response": ai_response_text})

    except Exception as e:
        print(f"Error processing chat request: {e}") # Log error server-side
        # Consider more specific error handling based on potential API errors
        return jsonify({"error": "An error occurred while processing your request."}), 500

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible on your network if needed
    # Default port is 5000
    app.run(debug=True, host='0.0.0.0', port=5000)