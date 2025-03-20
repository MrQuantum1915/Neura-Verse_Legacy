document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    console.log("Email:", email); 
    console.log("Password:", password); 

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); 
            window.location.href = 'Home.html'; 
        } else {
            alert(data.message); 
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});