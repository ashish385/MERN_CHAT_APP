import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ChatProvider from "./context/ChatProvider";

function App() {
  return (
    <div className="w-full min-h-screen bgImage pb-5">
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;
