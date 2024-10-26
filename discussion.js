// Hent referanser til DOM-elementer
const messageList = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const nicknameInput = document.getElementById('nickname-input');

// Lagre kallenavnet lokalt
let userNickname = localStorage.getItem('userNickname') || '';

// Hvis brukeren allerede har et kallenavn, fyll det inn i feltet
if (userNickname) {
    nicknameInput.value = userNickname;
}

// Lytt etter innsending av nye meldinger
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    const nickname = nicknameInput.value.trim();
    if (text && nickname) {
        // Lagre kallenavnet lokalt
        userNickname = nickname;
        localStorage.setItem('userNickname', userNickname);

        // Legg til meldingen i Firestore
        db.collection('messages').add({
            text: text,
            nickname: nickname,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            messageInput.value = '';
        }).catch((error) => {
            console.error('Feil ved sending av melding: ', error);
        });
    }
});

// Funksjon for å laste og vise meldinger
// function loadMessages() {
//     db.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
//         messageList.innerHTML = '';
//         snapshot.forEach((doc) => {
//             const message = doc.data();
//             const messageElement = document.createElement('div');
//             messageElement.classList.add('message');

//             // Sjekk om meldingen er fra brukeren selv
//             if (message.nickname === userNickname) {
//                 messageElement.classList.add('my-message');
//             } else {
//                 messageElement.classList.add('other-message');
//             }

//             // Formater tidsstempel
//             let time = '';
//             if (message.timestamp) {
//                 const date = message.timestamp.toDate();
//                 time = date.getHours().toString().padStart(2, '0') + ':' +
//                        date.getMinutes().toString().padStart(2, '0');
//             }

//             // Bygg meldingens HTML
//             messageElement.innerHTML = `
//                 <div class="message-header">
//                     <strong>${escapeHTML(message.nickname)}</strong>
//                     <span class="timestamp">${time}</span>
//                 </div>
//                 <div class="message-text">${escapeHTML(message.text)}</div>
//             `;
//             messageList.appendChild(messageElement);
//         });
//         // Scroll til bunnen av chatten
//         messageList.scrollTop = messageList.scrollHeight;
//     }, (error) => {
//         console.error('Feil ved henting av meldinger: ', error);
//     });
// }

// ... (resten av koden forblir uendret)

// Funksjon for å laste og vise meldinger
function loadMessages() {
    db.collection('messages').orderBy('timestamp').onSnapshot((snapshot) => {
        messageList.innerHTML = '';
        snapshot.forEach((doc) => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // Sjekk om meldingen er fra brukeren selv
            if (message.nickname === userNickname) {
                messageElement.classList.add('my-message');
            } else {
                messageElement.classList.add('other-message');
            }

            // Formater tidsstempel
            let time = '';
            if (message.timestamp) {
                const date = message.timestamp.toDate();
                time = date.getHours().toString().padStart(2, '0') + ':' +
                       date.getMinutes().toString().padStart(2, '0');
            }

            // Bygg meldingens HTML med slett-knapp
            messageElement.innerHTML = `
                <div class="message-header">
                    <strong>${escapeHTML(message.nickname)}</strong>
                    <span class="timestamp">${time}</span>
                </div>
                <div class="message-text">${escapeHTML(message.text)}</div>
            `;

            // Hvis meldingen er fra brukeren selv, legg til en slett-knapp
            if (message.nickname === userNickname) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Slett';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    deleteMessage(doc.id);
                });
                messageElement.appendChild(deleteButton);
            }

            messageList.appendChild(messageElement);
        });
        // Scroll til bunnen av chatten
        messageList.scrollTop = messageList.scrollHeight;
    }, (error) => {
        console.error('Feil ved henting av meldinger: ', error);
    });
}

// Funksjon for å slette en melding
function deleteMessage(messageId) {
    if (confirm('Er du sikker på at du vil slette denne meldingen?')) {
        db.collection('messages').doc(messageId).delete().catch((error) => {
            console.error('Feil ved sletting av melding: ', error);
        });
    }
}

// ... (resten av koden forblir uendret)


// Funksjon for å unngå XSS-angrep ved å escape HTML
function escapeHTML(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
}

// Start innlasting av meldinger når siden lastes
loadMessages();
