import { Badge } from '@chakra-ui/react';
import React from 'react'
import { RxCross2 } from "react-icons/rx";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <>
      <Badge
        className="flex flex-row cursor-pointer  m-[2px]"
              onClick={handleFunction}
      >
        <div className='flex justify-center items-center gap-2 rounded-lg bg-purple-700 text-white p-2' >
          {user.name}
          {admin === user._id && <span> (Admin)</span>}
          <RxCross2 />
        </div>
      </Badge>
    </>
  );
};

export default UserBadgeItem