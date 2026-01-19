const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting: 10 messages per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many requests, please try again later.'
});
app.use('/api/chat', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Knowledge base
const KNOWLEDGE_BASE = {
  company: 'NOWA Systems',
  services: ['Digital transformation', 'software development', 'AI automation', 'IT consulting'],
  website: 'nowa-systems.vercel.app',
  contact: 'info@nowasystems.com'
};

// Simple AI logic - keyword matching
function generateResponse(message) {
  const lowerMsg = message.toLowerCase();
  let confidence = 0;
  let response = '';

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    response = 'Hello! How can I help you with NOWA Systems today?';
    confidence = 1;
  } else if (lowerMsg.includes('services') || lowerMsg.includes('what do you do')) {
    response = `NOWA Systems offers: ${KNOWLEDGE_BASE.services.join(', ')}. How can I assist you with these services?`;
    confidence = 0.9;
  } else if (lowerMsg.includes('contact') || lowerMsg.includes('email')) {
    response = `You can contact us at ${KNOWLEDGE_BASE.contact} or visit our website at https://${KNOWLEDGE_BASE.website}.`;
    confidence = 0.9;
  } else if (lowerMsg.includes('website') || lowerMsg.includes('site')) {
    response = `Our website is https://${KNOWLEDGE_BASE.website}. Feel free to explore our services there!`;
    confidence = 0.9;
  } else if (lowerMsg.includes('digital transformation')) {
    response = 'Digital transformation involves modernizing business processes with technology. We help companies adapt to digital changes efficiently.';
    confidence = 0.8;
  } else if (lowerMsg.includes('ai') || lowerMsg.includes('automation')) {
    response = 'AI automation streamlines processes and improves efficiency. We specialize in implementing AI solutions for businesses.';
    confidence = 0.8;
  } else if (lowerMsg.includes('software development')) {
    response = 'We provide custom software development services tailored to your business needs. From web apps to mobile solutions.';
    confidence = 0.8;
  } else if (lowerMsg.includes('consulting')) {
    response = 'Our IT consulting services help you make informed technology decisions and optimize your IT infrastructure.';
    confidence = 0.8;
  } else if (lowerMsg.includes('help') || lowerMsg.includes('human') || lowerMsg.includes('speak to someone')) {
    confidence = 0.1; // Force escalation
  } else {
    response = "I'm not sure about that. Would you like me to connect you with our human support team?";
    confidence = 0.4;
  }

  return { response, confidence };
}

// Sanitize input
function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

// Chat endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { message, history } = req.body;
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
      return res.json({ response: 'Please enter a valid message.', escalate: false });
    }

    const aiResponse = generateResponse(sanitizedMessage);

    if (aiResponse.confidence < 0.6 || sanitizedMessage.toLowerCase().includes('help') || sanitizedMessage.toLowerCase().includes('human')) {
      return res.json({
        response: 'I need to escalate this to our human support team. Could you please provide your details?',
        escalate: true
      });
    }

    res.json({ response: aiResponse.response, escalate: false });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ response: 'Sorry, an error occurred. Please try again.', escalate: false });
  }
});

// Escalation endpoint
app.post('/api/escalate', async (req, res) => {
  try {
    const { name, email, phone, question, transcript } = req.body;

    // Sanitize inputs
    const sanitized = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      question: sanitizeInput(question)
    };

    if (!sanitized.name || !sanitized.email || !sanitized.phone || !sanitized.question) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Log to JSON file
    const logEntry = {
      ...sanitized,
      transcript,
      date: new Date().toISOString()
    };

    const logFile = path.join(__dirname, 'escalations.json');
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    // Send email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Set in environment
        pass: process.env.EMAIL_PASS  // App password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@nowasystems.com',
      subject: 'NOWA Systems Chatbot Escalation',
      html: `
        <h2>New Chatbot Escalation</h2>
        <p><strong>Name:</strong> ${sanitized.name}</p>
        <p><strong>Email:</strong> ${sanitized.email}</p>
        <p><strong>Phone:</strong> ${sanitized.phone}</p>
        <p><strong>Question:</strong> ${sanitized.question}</p>
        <p><strong>Timestamp:</strong> ${logEntry.date}</p>
        <h3>Conversation Transcript:</h3>
        <pre>${transcript}</pre>
      `
    };

    await transporter.sendMail(mailOptions);

    // WhatsApp notification (generate link for company)
    const whatsappMessage = `New escalation: ${sanitized.name} - ${sanitized.question}`;
    const whatsappUrl = `https://wa.me/254XXXXXXXXX?text=${encodeURIComponent(whatsappMessage)}`; // Replace with actual number

    res.json({
      success: true,
      message: 'Thank you! Our team will contact you soon.',
      whatsappUrl
    });
  } catch (error) {
    console.error('Escalation error:', error);
    res.status(500).json({ success: false, message: 'Failed to process escalation. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot backend running on port ${PORT}`);
});