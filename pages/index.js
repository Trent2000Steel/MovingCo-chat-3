import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hey there—welcome to MovingCo. I’m your personal move concierge. Ready to make this easy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    });

    const data = await res.json();
    const botMessage = { from: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h1>MovingCo Chat</h1>
      <div style={{ minHeight: 300, marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.from === 'user' ? 'You' : 'MovingCo'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={handleSend} style={{ padding: '0.5rem', marginLeft: 8 }}>Send</button>
    </div>
  );
}
