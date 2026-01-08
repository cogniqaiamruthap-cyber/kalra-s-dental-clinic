const CONFIG = {
    workerUrl: "https://long-wave-c9b2.cogniqaiamruthap.workers.dev", // Cloudflare Worker URL
    businessId: "dental",
    botName: "ClinicBot",
    clinicInfo: {
        name: "Dr. Kalra's Dental and Skin Clinic",
        location: "C-43, Jangpura Extension, New Delhi",
        phone: "97171 55497",
        timings: "10:30 AM - 1:30 PM & 5:30 PM - 8:30 PM (Mon-Sat)",
        services: ["Dental Implants", "Cosmetic Dentistry", "Root Canal", "Teeth Whitening", "Skin Treatments"]
    }
};

let conversationHistory = [];

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Toggle Chat Window
chatToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

chatClose.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Send Message Logic
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
}

async function handleBotResponse(userText) {
    const lowerText = userText.toLowerCase();

    // 1. Local Keyword Logic (Fast Responses)
    let responseText = "";

    if (lowerText.includes('timing') || lowerText.includes('open') || lowerText.includes('hours') || lowerText.includes('schedule')) {
        responseText = `Dr. Kalra's Dental and Skin Clinic is open Monday through Saturday from 10:30 AM to 1:30 PM and 5:30 PM to 8:30 PM. Sundays are by appointment only.`;
    } else if (lowerText.includes('location') || lowerText.includes('where') || lowerText.includes('address') || lowerText.includes('landmark') || lowerText.includes('find you')) {
        responseText = `We are located at C-43, Jangpura Extension, New Delhi. Our clinic is conveniently situated directly opposite Kashmiri Park and Prarambh Play School.`;
    } else if (lowerText.includes('book') || lowerText.includes('appointment')) {
        responseText = `To schedule an appointment, you can call us directly at +91 97171 55497 or book online via Practo. We also accommodate walk-ins when possible.`;
    } else if (lowerText.includes('service') || lowerText.includes('treatments') || lowerText.includes('specialty')) {
        responseText = `Our multi-specialty clinic offers Dental Implants, Cosmetic Dentistry, Root Canal Treatment, Teeth Whitening, and Clinical Skin Care. Which service would you like to know more about?`;
    } else if (lowerText.includes('pain') || lowerText.includes('hurt') || lowerText.includes('fear') || lowerText.includes('scared')) {
        responseText = `We specialize in providing "apprehension-free" and painless experiences using advanced anesthesia and gentle clinical techniques to ensure your absolute comfort.`;
    } else if (lowerText.includes('cost') || lowerText.includes('price')) {
        responseText = "Treatment costs vary depending on the specific procedure and your unique needs. We recommend a clinical consultation with Dr. Kalra for a detailed treatment plan and estimate.";
    } else if (lowerText.includes('dr. kalra') || lowerText.includes('doctor') || lowerText.includes('jasneet')) {
        responseText = `The clinic is led by Dr. Jasneet Singh Kalra, a specialist Implantologist and Cosmetic Surgeon, dedicated to providing high-quality dental and skin care since 2014.`;
    }

    if (responseText) {
        addMessage(responseText, 'bot');
        conversationHistory.push({ role: 'model', text: responseText });
        return;
    }

    // 2. AI Fallback (Worker API)
    const typingIndicator = showTypingIndicator();

    try {
        const response = await fetch(CONFIG.workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userText,
                business: CONFIG.businessId,
                history: conversationHistory
            })
        });

        const data = await response.json();

        // Remove typing indicator
        if (chatMessages.contains(typingIndicator)) {
            chatMessages.removeChild(typingIndicator);
        }

        if (data.success) {
            let botReply = data.reply || data.response || "I'm sorry, I couldn't process that.";

            // Proactively strip any emojis that might leak through
            botReply = botReply.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu, '');

            addMessage(botReply, 'bot');
            conversationHistory.push({ role: 'model', text: botReply });
        } else {
            console.error('Worker Error:', data.error);
            addMessage("I'm having a bit of trouble connecting to my brain. Please try again or call us at " + CONFIG.clinicInfo.phone, 'bot');
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        if (chatMessages.contains(typingIndicator)) {
            chatMessages.removeChild(typingIndicator);
        }
        addMessage("I'm sorry, I'm offline right now. You can reach us at " + CONFIG.clinicInfo.phone, 'bot');
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        conversationHistory.push({ role: 'user', text: text });
        chatInput.value = '';

        // Limit history to last 10 messages for performance/token limits
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        setTimeout(() => handleBotResponse(text), 500);
    }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
