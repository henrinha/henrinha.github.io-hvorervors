// discussion.js

document.addEventListener("DOMContentLoaded", function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const nicknameInput = document.getElementById('nickname-input');
    const messagesDiv = document.getElementById('messages');

    // Reference to Firestore collection
    const messagesRef = db.collection('messages');

    // Listen for new messages
    messagesRef.orderBy('timestamp').onSnapshot(snapshot => {
        messagesDiv.innerHTML = ''; // Clear messages
        snapshot.forEach(doc => {
            const messageData = doc.data();
            displayMessage(messageData);
        });
        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    // Display a message
    function displayMessage(data) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        if (data.nickname === nicknameInput.value) {
            messageElement.classList.add('my-message');
        } else {
            messageElement.classList.add('other-message');
        }

        const header = document.createElement('div');
        header.classList.add('message-header');
        header.textContent = data.nickname;

        const text = document.createElement('div');
        text.classList.add('message-text');
        text.textContent = data.message;

        messageElement.appendChild(header);
        messageElement.appendChild(text);
        messagesDiv.appendChild(messageElement);
    }

    // Handle form submission
    messageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        const nickname = nicknameInput.value.trim();

        if (message && nickname) {
            messagesRef.add({
                nickname: nickname,
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                messageInput.value = '';
            }).catch(error => {
                console.error("Error sending message: ", error);
            });
        }
    });
});
