// Execute content script when the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "/img/icon.png",
        title: "OpenPGP Email Lookup",
        message: "Looking up PGP keys for " + tab.url
    });
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
  });

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Show a notification if the PGP key has been copied to the clipboard
    if (message.id === 'pgpKeyCopied') {
        const email = message.email;
        const pgpKey = message.pgpKey;

        chrome.notifications.create({
            type: "basic",
            iconUrl: "/img/icon.png",
            title: "OpenPGP Email Lookup",
            message: "The PGP key for " + email + " has been copied to the clipboard."
        });

        sendResponse("Success!");
    }
});