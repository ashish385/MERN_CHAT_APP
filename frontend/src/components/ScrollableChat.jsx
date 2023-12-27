import React from 'react';
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from '../context/ChatProvider';
import {  isLastMessage, isSameSender, isSameSenderMargin } from '../config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages,user }) => {
    console.log("ScrollableChat mess",messages);
    
    return (
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex   text-white ${
                m.sender._id === user._id ? " items-end" : " items-start "
              } `}
            >
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, m, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt={"7px"}
                    mr={1}
                    size={"sm"}
                    cursor={"pointer"}
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                className={`${
                  m.sender._id === user._id ? "bg-[#72a8c7]" : "bg-[#5da277] " 
                  } rounded-lg px-3 py-2 max-w-[75%] mt-2  `}
                style={{marginLeft:isSameSenderMargin(messages,m,i,user._id)}}
              >
                {m.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    );
}

export default ScrollableChat

