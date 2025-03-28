import google.generativeai as genai
import os
from dotenv import load_dotenv


load_dotenv('.env') # patht to the .env file

genai.configure(api_key=os.getenv('Gemini_API_Key'))

# model = genai.get_tuned_model(f'tunedModels/{"iiitvadodara"}')
# print(model, "\n\n\n")
# model.state


name = 'iiitvadodara'
model = genai.GenerativeModel(model_name=f'tunedModels/{name}')
output = model.generate_content('What is IIIT V')
print(output.text)