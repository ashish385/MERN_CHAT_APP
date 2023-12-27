import React, { useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate('/chat');
    }

  },[navigate])
  return (
    <Container maxW={"xl"} centerContent>
      <Box className="flex bg-white p-3 mt-8 mb-4 border rounded-lg justify-center w-full">
        <Text fontSize={"4xl"} fontFamily="work sans" color={"black"}>
          Chat-App
        </Text>
      </Box>
      <Box className="bg-white w-full p-4 rounded-lg border ">
        <Tabs isFitted variant="soft-rounded" >
          <TabList mb="1em">
            <Tab >Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home