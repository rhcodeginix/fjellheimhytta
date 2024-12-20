// import React, { useEffect, useRef, useState } from "react";
// import Ic_chat_with_us from "@/public/images/Ic_chat_with_us.svg";
// import Ic_close from "@/public/images/Ic_close.svg";
// import Ic_Send from "@/public/images/Ic_Send.svg";
// import Ic_logo from "@/public/images/Ic_logo.svg";
// import Image from "next/image";

// const Chatbot: React.FC = () => {
//   const [isChatOpen, setChatOpen] = useState(false);
//   const getCurrentTime = () => {
//     const currentTime = new Date();
//     return `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
//       .getMinutes()
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "Hello! How can I assist you today?",
//       time: getCurrentTime(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");

//   const toggleChat = () => setChatOpen(!isChatOpen);

//   const sendMessage = () => {
//     if (!inputValue.trim()) return;

//     const userMessage = {
//       sender: "user",
//       text: inputValue.trim(),
//       time: getCurrentTime(),
//     };

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       userMessage,
//       getBotResponse(inputValue),
//     ]);
//     setInputValue("");
//   };

//   const getBotResponse = (input: string) => {
//     const responseText = input.toLowerCase().includes("hello")
//       ? "Hi there! How can I help?"
//       : "I'm not sure I understand. Could you clarify?";
//     return { sender: "bot", text: responseText, time: getCurrentTime() };
//   };

//   const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       sendMessage();
//     }
//   };

//   const today = new Date();
//   const days = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const dayName = days[today.getDay()];
//   const day = today.getDate().toString().padStart(2, "0");
//   const monthName = months[today.getMonth()];
//   const year = today.getFullYear();
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "instant" });
//     }
//   }, [messages]);
//   return (
//     <div className="chatbot_wrapper">
//       <Image
//         src={Ic_chat_with_us}
//         alt="Open chat"
//         className="chat-toggle-icon"
//         onClick={toggleChat}
//       />
//       {isChatOpen && (
//         <div className="chat-dropdown">
//           <div className="chat-header shadow-shadow1 flex items-center justify-between">
//             <Image src={Ic_logo} alt="logo" className="w-[90px]" />
//             <button
//               className="close-btn"
//               onClick={toggleChat}
//               aria-label="Close chat"
//             >
//               <Image src={Ic_close} alt="Close chat" />
//             </button>
//           </div>
//           <div className="chat-body">
//             <div className="chatbot_time">
//               {`${dayName}, ${day} ${monthName} ${year}`}
//             </div>
//             <div className="chatbot-body-div">
//               <div className="chatbot-body-div-wrapper">
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     className={`chat-message ${
//                       msg.sender === "user" ? "user" : "bot"
//                     }`}
//                   >
//                     <div className="chat-message-text">
//                       <div>{msg.text}</div>
//                       <span>{msg.time}</span>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>
//             </div>
//             <div className="send-chat-text">
//               <div className="chat_input_div">
//                 <input
//                   className="form-control"
//                   type="text"
//                   placeholder="Write a message..."
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={handleInputKeyDown}
//                   aria-label="Write a message"
//                 />
//                 <button
//                   className="send-button"
//                   onClick={sendMessage}
//                   aria-label="Send message"
//                 >
//                   <Image src={Ic_Send} alt="Send message" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;

import React, { useEffect, useRef, useState } from "react";
import Ic_chat_with_us from "@/public/images/Ic_chat_with_us.svg";
import Ic_close from "@/public/images/Ic_close.svg";
import Ic_Send from "@/public/images/Ic_Send.svg";
import Ic_logo from "@/public/images/Ic_logo.svg";
import Image from "next/image";

const Chatbot: React.FC = () => {
  const [isChatOpen, setChatOpen] = useState(false);
  const getCurrentTime = () => {
    const currentTime = new Date();
    return `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I assist you today?",
      time: getCurrentTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => setChatOpen(!isChatOpen);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      sender: "user",
      text: inputValue.trim(),
      time: getCurrentTime(),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      getBotResponse(inputValue),
    ]);
    setInputValue("");
  };

  const getBotResponse = (input: string) => {
    const responseText = input.toLowerCase().includes("hello")
      ? "Hi there! How can I help?"
      : "I'm not sure I understand. Could you clarify?";
    return { sender: "bot", text: responseText, time: getCurrentTime() };
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayName = days[today.getDay()];
  const day = today.getDate().toString().padStart(2, "0");
  const monthName = months[today.getMonth()];
  const year = today.getFullYear();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Adding the embedded chatbot configuration and script to the page
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.defer = true;
    script.setAttribute("chatbotId", "YbrgBkNnNWTkrRpQ23myI");
    script.setAttribute("domain", "www.chatbase.co");
    document.body.appendChild(script);

    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "YbrgBkNnNWTkrRpQ23myI",
        domain: "www.chatbase.co"
      }
    `;
    document.body.appendChild(configScript);

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  return (
    <div className="chatbot_wrapper">
      {isChatOpen && (
        <div className="chat-dropdown">
          <div className="chat-header shadow-shadow1 flex items-center justify-between">
            <Image src={Ic_logo} alt="logo" className="w-[90px]" />
            <button
              className="close-btn"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <Image src={Ic_close} alt="Close chat" />
            </button>
          </div>
          <div className="chat-body">
            <div className="chatbot_time">
              {`${dayName}, ${day} ${monthName} ${year}`}
            </div>
            <div className="chatbot-body-div">
              <div className="chatbot-body-div-wrapper">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      msg.sender === "user" ? "user" : "bot"
                    }`}
                  >
                    <div className="chat-message-text">
                      <div>{msg.text}</div>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="send-chat-text">
              <div className="chat_input_div">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Write a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  aria-label="Write a message"
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  aria-label="Send message"
                >
                  <Image src={Ic_Send} alt="Send message" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
