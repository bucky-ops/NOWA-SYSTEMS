// NOWA Systems Chatbot Widget
class NOWAChatbot {
  constructor() {
    this.apiUrl = 'https://your-vercel-app.vercel.app'; // Replace with deployed backend URL
    this.messages = [];
    this.isOpen = false;
    this.isEscalating = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.addEventListeners();
  }

  createWidget() {
    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'nowa-chatbot-widget';
    widget.innerHTML = `
      <div id="nowa-chat-toggle" class="fixed bottom-6 right-6 bg-emerald-600 text-white rounded-full w-20 h-14 flex items-center justify-center cursor-pointer shadow-lg hover:bg-emerald-700 transition-colors z-50">
        <img src="images/nowa-icon.png" alt="NOWA" class="w-6 h-6 mr-1 rounded-full">
        <span class="text-sm font-semibold">Chat</span>
      </div>

      <div id="nowa-chat-window" class="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 text-white rounded-2xl shadow-2xl hidden flex flex-col z-40">
        <div id="nowa-chat-header" class="bg-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 class="font-bold">NOWA AI Assistant</h3>
            <p class="text-sm opacity-90">How can we help you?</p>
          </div>
          <button id="nowa-chat-close" class="text-white hover:text-gray-200">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div id="nowa-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
          <div class="bg-gray-700 rounded-lg p-3 max-w-xs">
            <p>Hello! I'm the NOWA Systems AI Assistant. How can I help you today?</p>
          </div>
        </div>

        <div id="nowa-chat-input-area" class="p-4 border-t border-gray-700">
          <div class="flex space-x-2">
            <input id="nowa-chat-input" type="text" placeholder="Type your message..." class="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <button id="nowa-chat-send" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Send
            </button>
          </div>
        </div>

        <div id="nowa-escalation-form" class="p-4 border-t border-gray-700 hidden">
          <h4 class="font-bold mb-3">Please provide your details:</h4>
          <form id="nowa-escalation-form-element">
            <input id="escalate-name" type="text" placeholder="Full Name" class="w-full mb-2 bg-gray-800 text-white rounded px-3 py-2" required>
            <input id="escalate-email" type="email" placeholder="Email" class="w-full mb-2 bg-gray-800 text-white rounded px-3 py-2" required>
            <input id="escalate-phone" type="tel" placeholder="Phone" class="w-full mb-4 bg-gray-800 text-white rounded px-3 py-2" required>
            <button type="submit" class="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition-colors">Submit</button>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    // Initialize Lucide icons
    if (typeof createIcons !== 'undefined') {
      createIcons();
    }
  }

  addEventListeners() {
    const toggle = document.getElementById('nowa-chat-toggle');
    const close = document.getElementById('nowa-chat-close');
    const send = document.getElementById('nowa-chat-send');
    const input = document.getElementById('nowa-chat-input');
    const form = document.getElementById('nowa-escalation-form-element');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.closeChat());
    send.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    form.addEventListener('submit', (e) => this.handleEscalation(e));
  }

  toggleChat() {
    const window = document.getElementById('nowa-chat-window');
    this.isOpen = !this.isOpen;
    window.classList.toggle('hidden');
  }

  closeChat() {
    const window = document.getElementById('nowa-chat-window');
    this.isOpen = false;
    window.classList.add('hidden');
  }

  async sendMessage() {
    const input = document.getElementById('nowa-chat-input');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage('user', message);
    input.value = '';

    // Local AI logic for demo
    const localResponse = this.generateLocalResponse(message.toLowerCase());
    this.addMessage('bot', localResponse.response);

    if (localResponse.escalate) {
      this.isEscalating = true;
      this.showEscalationForm(message);
    }

    // Uncomment below for backend integration
    /*
    try {
      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: this.messages })
      });
      const data = await response.json();

      this.addMessage('bot', data.response);

      if (data.escalate) {
        this.isEscalating = true;
        this.showEscalationForm(message);
      }
    } catch (error) {
      this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
    }
    */
  }

  generateLocalResponse(message) {
    let response = '';
    let escalate = false;

    if (message.includes('hello') || message.includes('hi')) {
      response = 'Hello! How can I help you with NOWA Systems today?';
    } else if (message.includes('what is nowa') || (message.includes('what') && message.includes('nowa'))) {
      response = 'NOWA Systems is a digital credits and transport platform for the Nakuru community in Kenya. We provide an inclusive digital ecosystem for local commerce and safe transport.';
    } else if (message.includes('services') || message.includes('what do you do')) {
      response = 'NOWA Systems offers: Digital transformation, software development, AI automation, IT consulting.';
    } else if (message.includes('contact') || message.includes('email')) {
      response = 'You can contact us at info@nowasystems.com or visit our website.';
    } else if (message.includes('help') || message.includes('human')) {
      escalate = true;
      response = 'I need to escalate this to our human support team. Could you please provide your details?';
    } else {
      response = "I'm not sure about that. Would you like me to connect you with our human support team?";
      escalate = true; // Force escalation for demo
    }

    return { response, escalate };
  }

  addMessage(sender, text) {
    const messagesContainer = document.getElementById('nowa-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'bg-emerald-600 rounded-lg p-3 ml-auto max-w-xs' : 'bg-gray-700 rounded-lg p-3 max-w-xs';
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.messages.push({ sender, text });
  }

  showEscalationForm(question) {
    document.getElementById('nowa-chat-input-area').classList.add('hidden');
    document.getElementById('nowa-escalation-form').classList.remove('hidden');
    this.escalationQuestion = question;
  }

  async handleEscalation(e) {
    e.preventDefault();

    const name = document.getElementById('escalate-name').value;
    const email = document.getElementById('escalate-email').value;
    const phone = document.getElementById('escalate-phone').value;

    try {
      const response = await fetch(`${this.apiUrl}/api/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          question: this.escalationQuestion,
          transcript: JSON.stringify(this.messages)
        })
      });
      const data = await response.json();

      if (data.success) {
        this.addMessage('bot', data.message);
        document.getElementById('nowa-escalation-form').classList.add('hidden');
        document.getElementById('nowa-chat-input-area').classList.remove('hidden');
        this.isEscalating = false;
        // Optionally open WhatsApp
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to submit. Please try again.');
    }
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NOWAChatbot();
});