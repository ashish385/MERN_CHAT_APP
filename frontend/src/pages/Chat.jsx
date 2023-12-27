import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideDrawer from "../components/Miscelleneous/SideDrawer";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";
import {Box} from '@chakra-ui/react'



const Chat = () => {

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);


   
  return (
    <div>
      {user && <SideDrawer />}
      <Box className="flex justify-between gap-2 w-full h-[91.5vh]">
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chat