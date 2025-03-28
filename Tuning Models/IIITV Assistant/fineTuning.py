import google.generativeai as genai # update the code according to new sdk
import os
import json
import time
import pandas as pd
import seaborn as sns
from dotenv import load_dotenv


load_dotenv('.env') # patht to the .env file
genai.configure(api_key=os.getenv('Gemini_API_Key'))

# for i, m in zip(range(5), genai.list_tuned_models()):
#   print(m.name)

#this selects the base model which will be used for fine tuning
base_model = [
    m
    for m in genai.list_models()
    if "createTunedModel" in m.supported_generation_methods and "flash" in m.name][0]
#selects the model having attribute "createTunedModel" ensuring only those which can be tuned and also flash in its name. Then it selects the first model from that filtered list --> [0]th index.


print(base_model)

with open("TuningDataset.json", "r") as file:
    its_training_data = json.load(file)


#to tune the model uncomment this block of code below

# operation = genai.create_tuned_model(
#     # we can use a tuned model here too. set source_model="tunedModels/..."
#     source_model=base_model.name, # gets the name of base model

#     training_data=its_training_data,
     
#     id = 'iiitvadodara',
#     epoch_count = 100,
#     batch_size=4,
#     learning_rate=0.001,
# )




# for status in operation.wait_bar():
#     time.sleep(30)

modelName='iiitvadodara'
model = genai.get_tuned_model(f'tunedModels/{modelName}')
print(model)
model.state
# operation.metadata




#- plot the loss curve after tuning is complete
# model = operation.result()

snapshots = pd.DataFrame(model.tuning_task.snapshots)

sns.lineplot(data=snapshots, x = 'epoch', y='mean_loss')