(function() {
  'use strict';

  // Read configuration from current script tag
  const scriptTag = document.currentScript || document.querySelector('script[data-tenant]');
  const tenantId = scriptTag ? scriptTag.getAttribute('data-tenant') : 'demo-tenant';
  const apiBase = scriptTag ? (scriptTag.getAttribute('data-api') || 'https://skarworld-api.onrender.com/api/v1') : 'https://skarworld-api.onrender.com/api/v1';

  // Floating trigger button
  const button = document.createElement('div');
  button.id = 'skarworld-widget-btn';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  button.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #4f46e5;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    cursor: pointer;
    z-index: 999999;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  `;

  // Chat window container
  const chatWindow = document.createElement('div');
  chatWindow.id = 'skarworld-widget-window';
  chatWindow.style.cssText = `
    position: fixed;
    bottom: 96px;
    right: 24px;
    width: 360px;
    height: 520px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    border: 1px solid #e2e8f0;
  `;

  chatWindow.innerHTML = `
    <div style="background: #4f46e5; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-weight: 600; font-size: 15px;">Revenue Copilot</div>
        <div style="font-size: 12px; opacity: 0.9;">Ask questions & explore pricing</div>
      </div>
      <button id="skarworld-widget-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">✕</button>
    </div>
    <div id="skarworld-chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
      <div style="align-self: flex-start; max-width: 80%; background: #ffffff; padding: 10px 14px; border-radius: 12px; font-size: 14px; border: 1px solid #e2e8f0; color: #1e293b;">
        Hello! How can we assist your business today? Feel free to ask about our software, consulting packages, or custom solutions.
      </div>
    </div>
    <div style="padding: 12px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; background: white;">
      <input id="skarworld-chat-input" placeholder="Type a message..." style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none;" />
      <button id="skarworld-chat-send" style="background: #4f46e5; color: white; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-weight: 500;">Send</button>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(chatWindow);

  let isOpen = false;
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
  }

  button.addEventListener('click', toggleChat);
  chatWindow.querySelector('#skarworld-widget-close').addEventListener('click', toggleChat);

  const input = chatWindow.querySelector('#skarworld-chat-input');
  const sendBtn = chatWindow.querySelector('#skarworld-chat-send');
  const messagesBox = chatWindow.querySelector('#skarworld-chat-messages');

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'align-self: flex-end; max-width: 80%; background: #4f46e5; color: white; padding: 10px 14px; border-radius: 12px; font-size: 14px;';
    userMsg.textContent = text;
    messagesBox.appendChild(userMsg);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.style.cssText = 'align-self: flex-start; max-width: 80%; background: #ffffff; padding: 10px 14px; border-radius: 12px; font-size: 14px; border: 1px solid #e2e8f0; color: #1e293b;';
      botMsg.textContent = "Thank you for reaching out! A dedicated sales specialist and our AI revenue agent are reviewing your request. We'll be in touch shortly.";
      messagesBox.appendChild(botMsg);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 600);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
