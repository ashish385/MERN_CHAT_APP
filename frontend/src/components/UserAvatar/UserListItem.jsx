import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({user, handleFunction }) => {
    

  return (
    <div>
      <Box
        onClick={handleFunction}
        className="w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg hover:bg-[#38B2AC] hover:text-white cursor-pointer "
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
}

export default UserListItem