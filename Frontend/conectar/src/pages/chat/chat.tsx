import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import './chat.css'

const socket = io("http://localhost:3000");

interface Messages {
  body: string;
  from: string;
}

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newMessage = {body: message, from: "Tú"};
    setMessages([...messages, newMessage]);
    socket.emit("message", message);
    setMessage("");
  };
  
  useEffect(() => {
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (message: Messages) => {
    setMessages((state) => [...state, message]);
  };

  return (
    <div className="chat">
      <div className="chat__container">
        <header className="chat__header">
          <div className="chat__title">Chat en vivo</div>
          <div className="chat__status">
            <span className="chat__dot" />
            Conectado
          </div>
        </header>

        <form className="chat__composer" onSubmit={handleSubmit}>
          <input
            className="chat__input"
            id="message"
            name="message"
            type="text"
            placeholder="Escribe tu mensaje..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="chat__btn" type="submit">Enviar</button>
        </form>

        <ul className="chat__messages">
          {messages.map((message, i) => (
            <li key={i} className="msg">
              <div className="msg__bubble">
                {message.from}: {message.body}
              </div>
              <div className="msg__meta">
                <span>{message.from || "Usuario"}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Chat;