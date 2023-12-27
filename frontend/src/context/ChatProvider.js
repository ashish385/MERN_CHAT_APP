import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const chatContext = createContext();
 
export const ChatState = () => {
    const context = useContext(chatContext);
      if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    
    return context;
};



const ChatProvider = ({ children }) => {

    
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([])

  const BASE_URL = "http://localhost:5000"

  const value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    BASE_URL,
    notification,
    setNotification,
  };

    useEffect(() => {

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo ) {
            navigate('/')
        }
      setUser(userInfo);
    },[navigate]);
    return (
      <chatContext.Provider
        value={value}
      >
        {children}
      </chatContext.Provider>
    );
};



export default ChatProvider;
