var add = document.getElementById("btn");
var arr = [];

// Add event listener to the button
add.addEventListener("click", () => {
    var title = document.getElementById("name").value;
    var dob = document.getElementById("date").value;
    var mail = document.getElementById("email").value; // Get email value

    // Input validation
    if (!title || !dob || !mail) {
        alert("Please fill in all fields.");
        return;
    }

    var today = new Date();
    var user_birth = new Date(dob);

    // Check if the date is valid
    if (isNaN(user_birth.getTime())) {
        alert("Invalid date format. Please enter a valid date.");
        return;
    }

    let next_birthday = new Date(today.getFullYear(), user_birth.getMonth(), user_birth.getDate());
    if (today > next_birthday) {
        next_birthday.setFullYear(today.getFullYear() + 1);
    }
    var dif = next_birthday - today;
    var days = Math.floor((dif / (1000 * 60 * 60 * 24)));

    // Object to send to the server
    var obj = {
        name: title,
        email: mail,
        date: dob
    };

    // Make a POST request to the server
    fetch('/birthday', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj), // Convert the object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        // Create a new paragraph element for displaying the result
        var para = document.createElement("p");
        var result = document.getElementById("result");
        var del = document.createElement("button");
        del.innerText = "Delete";
        del.style.color = "#AE1100";

        // If the birthday is today
        if (today.getMonth() === user_birth.getMonth() && today.getDate() === user_birth.getDate()) {
            para.innerText = `Happy birthday ${title}! 🎉`;
            var song = document.createElement("audio");
            song.src = "path/to/your/song.mp3"; // Add the source of the audio file here
            song.autoplay = true; // Optionally autoplay the audio
            para.appendChild(song); // Append the audio element to the paragraph
            alert("Your birthday is saved.");
        } else if (days < 10) {
            para.innerText = `Hey ${title}, your next birthday is in ${days + 1} days.`;
            alert("Your birthday is saved.");
        }

        para.appendChild(del);
        result.appendChild(para);
        para.style.color = "black";

        // Event listener to delete the birthday reminder
        del.addEventListener("click", () => {
            result.removeChild(para);
        });

        // Clear the input fields after saving
        document.getElementById("name").value = '';
        document.getElementById("date").value = '';
        document.getElementById("email").value = '';
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Error saving birthday. Please try again.');
    });
});
