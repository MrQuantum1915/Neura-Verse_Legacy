const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');
const { list } = require("parser");
// const bodyParser = require('body-parser');
require('dotenv').config(); // lib to load api key from .env file
const app = express();
const port = 3000;


app.use(cors());
// app.use(bodyParser.json());


// const users = [
//     {
//         username: 'testuser@gmail.com',
//         password: 'password123'
//     }
// ];


// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     console.log("Received Username:", username);
//     console.log("Received Password:", password);

//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }


//     const user = users.find(user => user.username === username);
//     if (!user) {
//         console.log("User not found");
//         return res.status(401).json({ message: 'Invalid username or password' });
//     }


//     if (user.password !== password) {
//         console.log("Password mismatch");
//         return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     res.status(200).json({ message: 'Login successful' });
// });



app.get('/', async (request, response) => {
    try {
        const prompt = request.query.prompt;
        const page = request.headers['x-page-origin'];
        console.log("Request from Page:", page);

        if (!prompt) {
            return response.status(400).send('Prompt is required');
        }
        // console.log(list.GoogleGenerativeAI.models)
        const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
        let model;
        let promptText;


        if (page === 'iiitv_assistant.html') {
            model = genAI.getGenerativeModel({ model: "tunedModels/iiitvadodara" });
            promptText = `${prompt}`;
        }
        
        else {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            promptText = `You have to respond to this user prompt. Generate a single HTML <div class="GeminiResponse"> element with properly formatted content. Adjust headings (e.g., h1 to h2) and other elements accordingly. Exclude CSS, <head>, <body>, or <html> tags. Provide only the <div>...</div> content without wrapping it in code blocks or adding extra text. Do not write "Response to ....", only write the response content. User Prompt: ${prompt}`;
        }
        
        console.log("Prompt:", prompt);
        
        const result = await model.generateContent(promptText);
        const responseText = result.response.text();
        response.send(responseText);
    } catch (error) {
        console.error("Error generating or sending response:", error);
        response.status(500).send('Error generating response');
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});