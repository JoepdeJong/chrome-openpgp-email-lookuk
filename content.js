function retrievePgpKeyFromEmail(email) {
    // Send a get request to "https://keys.openpgp.org/vks/v1/by-email/" + email
    // If the response is 200, return the pgp key
    // If the response is 404, return null

    // Do request
    var request = new XMLHttpRequest();
    request.open("GET", "https://keys.openpgp.org/vks/v1/by-email/" + email, false);
    request.send(null);

    console.log(request);
    // Check response
    if (request.status == 200) {
        // Return the pgp key
        return request.responseText;
    } else if (request.status == 404) {
        // Return null
        return null;
    }
    return null;
}

function addPgpIcon(parent, email, pgpKey) {
    // Create a DOM element to display an icon (&#128274;) and copy the pgp key to the clipboard when clicked
    var pgpIcon = document.createElement("a");
    pgpIcon.setAttribute("href", "#");
    // Set class to "pgp-email-lookup-icon"
    pgpIcon.setAttribute("class", "pgp-email-lookup-icon");
    pgpIcon.setAttribute("data-key", pgpKey);
    pgpIcon.innerHTML = "&#128274;";

    // Add the DOM element after the parent
    parent.parentNode.insertBefore(pgpIcon, parent.nextSibling);

    // Add an event listener to the DOM element
    pgpIcon.addEventListener("click", function() {
        // Copy the pgp key to the clipboard
        navigator.clipboard.writeText(this.getAttribute("data-key"));

        // Send message to background.js
        chrome.runtime.sendMessage({id: "pgpKeyCopied", email: email, pgpKey: pgpKey});
    });
}

// Remove all DOM elements with the class "pgp-email-lookup-icon"
var listOfPgpIcons = document.querySelectorAll(".pgp-email-lookup-icon");
for (var i = 0; i < listOfPgpIcons.length; i++) {
    listOfPgpIcons[i].parentNode.removeChild(listOfPgpIcons[i]);
}

// Retrieve a list of all DOM elements that contain an email address
var listOfEmails = document.querySelectorAll("[href^='mailto:']");

// Loop through the list of email addresses
for (var i = 0; i < listOfEmails.length; i++) {
    // Retrieve the email address
    var email = listOfEmails[i].href.substring(7);
    // Retrieve the pgp key
    var pgpKey = retrievePgpKeyFromEmail(email);
    // If the pgp key is not null, display it
    if (pgpKey != null) {
        addPgpIcon(listOfEmails[i], email, pgpKey);
    }
}