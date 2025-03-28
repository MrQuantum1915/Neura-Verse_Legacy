function typewriterEffect(element, text, speed = 10) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// function formatResponse(responseText) {
//     const formattedResponse = responseText.replace(/(?:\r\n|\r|\n)/g, '<br>');
//     return formattedResponse;
// }

// function formatGeminiResponse(responseText) {
//     // replace newlines with <br> tags
//     let formattedText = (responseText || '').replace(/\n/g, '<br>   <br>');

//     // replace double asterisks with bold tags
//     formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

//     // replace single asterisks with bullet points
//     formattedText = formattedText.replace(/\*(.*?)\*/g, '<li>$1</li>');

//     // wrap the bullet points in a <ul> tag
//     formattedText = '<ul>' + formattedText + '</ul>';

//     // split into paragraphs and wrap in <p> tags
//     let paragraphs = formattedText.split('<br><br>'); //Using <br><br> to detect paragraph breaks.
//     let html = paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
//     return html;
// }

function getPageName(){
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts.pop();
     // return the page name : home.html from the whole path 
}
const pagename = getPageName();

function submitPromptandGetResponse() {
    const prompt = document.getElementById("prompt-box").value;
    document.getElementById("prompt-box").value = ''; //sets the value in the text box to void :)

    const responseContainer = document.querySelector('.response-container');
    const logUserPrompt = document.createElement('div');
    logUserPrompt.id = "user-prompt-logging";
    // const user = document.createElement('div');
    // user.classList.add("user");
    // user.textContent = "You";
    // logUserPrompt.appendChild(user);
    logUserPrompt.classList.add("userPrompt");

    logUserPrompt.appendChild(document.createTextNode(prompt));
    responseContainer.appendChild(logUserPrompt);

    const loadingElement = document.createElement('div');
    loadingElement.id = "generating-response-text";
    loadingElement.textContent = "Generating Response...";
    responseContainer.appendChild(loadingElement);


    //encoding for safety standard :)
    fetch(`http://localhost:3000?prompt=${encodeURIComponent(prompt)}`, {
        headers: {
            'X-Page-Origin': pagename //added custom header to send information about which page send the request
        }
    }) 
        .then(response => response.text())
        .then(data => {

            responseContainer.removeChild(loadingElement);


            let responseElement = document.querySelector(".response-container");
            // responseContainer.appendChild(responseElement);
            // let formattedHtml = formatGeminiResponse(data);
            console.log(data);
            // console.log(formattedHtml);

            // Then insert formattedHtml into your html element.
            responseElement.innerHTML += data;

            Prism.highlightAll(); //colourise the code in the code element
            responseElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // typewriterEffect(responseElement, data, 10);
        })
        .catch(error => {
            console.error("Error fetching data:", error);


            responseContainer.removeChild(loadingElement);


            const errorElement = document.createElement('div');
            errorElement.textContent = "Failed to load response.";
            responseContainer.appendChild(errorElement);
        });
}

document.getElementById("prompt-box").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitPromptandGetResponse();
    }
});

document.getElementById("submit-message-button").addEventListener("click", () => {
    submitPromptandGetResponse();
});