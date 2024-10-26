// Hent referanser til DOM-elementer
const messageList = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Referanse til Firestore-samlingen
const messagesRef = db.collection('messages');

// Funksjon for å laste og vise meldinger
function loadMessages() {
    messagesRef.orderBy('timestamp').onSnapshot(snapshot => {
        messageList.innerHTML = '';
        snapshot.forEach(doc => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.textContent = message.text;
            messageList.appendChild(messageElement);
        });
    });
}

// Lytt etter innsending av nye meldinger
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text) {
        messagesRef.add({
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            messageInput.value = '';
        }).catch(error => {
            console.error('Feil ved sending av melding: ', error);
        });
    }
});

// Start innlasting av meldinger når siden lastes
loadMessages();
