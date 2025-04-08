const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleGenAI } = require("@google/genai"); // Import the new library
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load API key from .env file

const app = express();
const port = 3000;

app.use(cors());

app.get('/', async (request, response) => {
    try {
        const prompt = request.query.prompt;
        const page = request.headers['x-page-origin'];
        console.log("Request from Page:", page);

        if (!prompt) {
            return response.status(400).send('Prompt is required');
        }

        let responseText;

        if (page === 'iiitv_assistant.html') {
            const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
            const model = genAI.getGenerativeModel({ model: "tunedModels/iiitvadodara" });
            const promptText = `You are an AI assistant for IIIT Vadodara. Respond to the user's prompt by outputting a single HTML <div> element that contains your answer. The content inside the <div> can be plain text or include other HTML elements for formatting, but do not use markdown. Do not include any text or elements outside of this <div>. User Prompt: ${prompt}`;
            const result = await model.generateContent(promptText);
            responseText = result.response.text();
            response.send(responseText);
        } 
        
        else if(page === 'algomind.html'){
            const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const promptText = `Act as a code helper for the user. Provide coding assistance and format your response within a single <div> element. Style the output using HTML elements like <b>, <i>, <h1>, etc., for clarity and emphasis. User Prompt: ${prompt}`;
            const result = await model.generateContent(promptText);
            responseText = result.response.text();
            response.send(responseText);
        }

        else if (page === 'roadmap.html') {

            const curriculum = `First Year – Semester I
            (Common to all branches of studies)

            1. MA101 - Mathematics-I (Linear Algebra and Matrices) [L:3, T:1, P:0, C:4]
            2. PH100* - Mechanics and Thermodynamics [L:3, T:1, P:0, C:4]
            3. PH160* - Mechanics and Thermodynamics Lab [L:0, T:0, P:2, C:1]
            4. IT101 - Computer Programming and Problem Solving [L:3, T:0, P:0, C:3]
            5. IT161 - Computer Programming and Problem Solving Lab [L:0, T:0, P:3, C:2]
            6. EC100* - Basic Electronic Circuits [L:3, T:1, P:0, C:4]
            7. EC160* - Basic Electronic Circuits Lab [L:0, T:0, P:3, C:2]
            8. HS101 - Spoken and Written Communication [L:2, T:0, P:2, C:3]

            Total: L = 14, T = 3, P = 10, C = 23

            *Courses marked with an asterisk may be offered in both Autumn and Winter Semesters.`;
            // use the new GoogleGenAI library for roadmap.html


            
            const parts = promptString.split("explorationPreference:");
            if (parts.length > 1) {
            const value = parts[1].trim();
            const explorationPreferenceValue = value;
            let promptText = "";
            if (explorationPreferenceValue === "project-based") {
            promptText += ` The student prefers a project-based approach to exploring new tech fields instead of traditional Roadmaps.
            Give several project ideas aligning with what they are studying right now in there curriculum.
            
            1 Analyze the student's current knowledge and experience (provided in the input).
            2 Identify nearby curriculum topics.
            3 Project ideas should be specific, creative, and unique, rather than generic.
            4 Define the overall structure of the project, but don't tell us how to do it or step by step process, keep it open-ended.
            5 Give atleast 6 ideas. 


            Output rules:
            1 Enclose all content in one <div>.
            2 Use a new <div style="border: 1px solid; padding: 10px; margin: 10px 0;"> for each idea.
            3 Use HTML tags for formatting (e.g., <b>, <i>, <ul>, <li>) without Markdown.
            4 Do not add code fences
            5 Do not specify font colors or background colors.
            6 Ensure clear, structured, and readable output.
            
            User Data:
            [${prompt}]

            Curriculum Structure:
            [${curriculum}]`;
            }
            else {
            // Prepare the prompt for Gemini
            promptText += `You are an expert AI mentor helping a student build a personalized learning roadmap based on the provided user data and the institute's curriculum structure, generate a personalized roadmap that aligns with the academic timeline and milestones. The roadmap should assess the student's current knowledge, identify gaps, and recommend a step-by-step plan.

            
            1. Assess the student's current knowledge and experience from the input.
            2. Design a roadmap with monthly goals.
            3. Align the roadmap with the curriculum's timeline.
            4. Include online resource links from internet searches.
            5. List specific action items: topics, tools, projects, and milestones.

            Output rules:
            1 Enclose all content in one <div>.
            2 Use a new <div style="border: 1px solid; padding: 10px; margin: 10px 0;"> for each month.
            3 Use HTML tags for formatting (e.g., <b>, <i>, <ul>, <li>) without Markdown.
            4 Do not add code fences
            5 Do not specify font colors or background colors.
            6 Ensure clear, structured, and readable output.

            User Data:
            [${promptText}]

            Curriculum Structure:
            [${curriculum}]`;
            }
            const ai = new GoogleGenAI({ apiKey: process.env.Gemini_API_Key });
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [promptText],
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            // extract the response text and grounding metadata
            responseText = result.text;
            const groundingMetadata = result.candidates[0]?.groundingMetadata?.searchEntryPoint?.renderedContent;

            console.log("Grounding Metadata:", groundingMetadata);
            response.send(responseText);
        } }
        
        else {
            const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const promptText = `You have to respond to this user prompt. Generate a single HTML <div class="GeminiResponse"> element with properly formatted content. Adjust headings (e.g., h1 to h2) and other elements accordingly. Exclude CSS, <head>, <body>, or <html> tags. Provide only the <div>...</div> content without wrapping it in code blocks or adding extra text. Do not write "Response to ....", only write the response content. User Prompt: ${prompt}`;
            const result = await model.generateContent(promptText);
            responseText = result.response.text();
            response.send(responseText);
        }
        
    } 
    catch (error) {
        console.error("Error generating or sending response:", error);
        response.status(500).send('Error generating response');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const express = require('express');
// const cors = require('cors');
// const { list } = require("parser");
// // const bodyParser = require('body-parser');
// require('dotenv').config(); // lib to load api key from .env file
// const app = express();
// const port = 3000;


// app.use(cors());
// // app.use(bodyParser.json());


// // const users = [
// //     {
// //         username: 'testuser@gmail.com',
// //         password: 'password123'
// //     }
// // ];


// // app.post('/login', async (req, res) => {
// //     const { username, password } = req.body;

// //     console.log("Received Username:", username);
// //     console.log("Received Password:", password);

// //     if (!username || !password) {
// //         return res.status(400).json({ message: 'Username and password are required' });
// //     }


// //     const user = users.find(user => user.username === username);
// //     if (!user) {
// //         console.log("User not found");
// //         return res.status(401).json({ message: 'Invalid username or password' });
// //     }


// //     if (user.password !== password) {
// //         console.log("Password mismatch");
// //         return res.status(401).json({ message: 'Invalid username or password' });
// //     }

// //     res.status(200).json({ message: 'Login successful' });
// // });



// app.get('/', async (request, response) => {
//     try {
//         const prompt = request.query.prompt;
//         const page = request.headers['x-page-origin'];
//         console.log("Request from Page:", page);

//         if (!prompt) {
//             return response.status(400).send('Prompt is required');
//         }
//         // console.log(list.GoogleGenerativeAI.models)
//         const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
//         let model;
//         let promptText;


//         if (page === 'iiitv_assistant.html') {
//             model = genAI.getGenerativeModel({ model: "tunedModels/iiitvadodara" });
//             promptText = `You are assistant of IIIT Vadodara. You have to give answer for the user prompt. give the response inside <div></div> block and not in markdown. User Prompt: ${prompt}`;
//         }
//         else if(page==='roadmap.html'){
//             model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
//             promptText = `${prompt}`;
//         }

//         else {
//             model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//             promptText = `You have to respond to this user prompt. Generate a single HTML <div class="GeminiResponse"> element with properly formatted content. Adjust headings (e.g., h1 to h2) and other elements accordingly. Exclude CSS, <head>, <body>, or <html> tags. Provide only the <div>...</div> content without wrapping it in code blocks or adding extra text. Do not write "Response to ....", only write the response content. User Prompt: ${prompt}`;
//         }
        
//         console.log("Prompt:", prompt);
        
//         const result = await model.generateContent(promptText);
//         const responseText = result.response.text();
//         response.send(responseText);
//     } catch (error) {
//         console.error("Error generating or sending response:", error);
//         response.status(500).send('Error generating response');
//     }
// });


// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });