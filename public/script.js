var add = document.getElementById("btn");
var arr = [];

// Add event listener to the button
add.addEventListener("click", () => {
    var title = document.getElementById("name").value;
    var dob = document.getElementById("date").value;
    var mail = document.getElementById("email").value; // Get email value

    // Create a new paragraph element for displaying the result
    var para = document.createElement("p");
    var result = document.getElementById("result");
    var del = document.createElement("button");
    del.innerText = "delete";
    del.style.color = "#AE1100";

    var today = new Date();
    var user_birth = new Date(dob);
    
    let next_birthday = new Date(today.getFullYear(), user_birth.getMonth(), user_birth.getDate());
    if (today > next_birthday) {
        next_birthday.setFullYear(today.getFullYear() + 1);
    }
    var dif = next_birthday - today;
    var days = Math.floor((dif / (1000 * 60 * 60 * 24)));
    // console.log(days);

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
        // If the birthday is today
        if (today.getMonth() == user_birth.getMonth() && today.getDate() == user_birth.getDate()) {
            para.innerText = `Happy birthday ${title}`;
            var song = document.createElement("audio");
            
            para.appendChild(song); // Append the audio element to the paragraph
            para.appendChild(del);
            result.appendChild(para);
            alert("Your birthday is Saved")
           
            para.style.color = "black";
        } else if(days<10){
            para.innerText = `Hey ${title}, your next birthday is in ${days + 1} days.`;
            para.appendChild(del);
            result.appendChild(para);
            console.log(para);
            para.style.color = "black";
            alert("Your birthday is Saved")
            
        }

        // Append the delete button
       

        // Event listener to delete the birthday reminder
        del.addEventListener("click", () => {
            result.removeChild(para);
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
