import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('.env') # patht to the .env file
genai.configure(api_key=os.getenv('Gemini_API_Key'))


genai.get_tuned_model(f'tunedModels')

