import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from '../../services/apis';

const {USER_API } = endpoints;

const Login = () => {

  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      toast({
        title: "please fill all the field!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      return;
    }

    console.log(email, password);
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${USER_API}`+"/login",
        { email, password },
        config
      );
      console.log("userData", data);

      toast({
        title: "Login Successfully!",
        status: "success",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast({
        title: "Unauthorized access!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  }
  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "string" : "password"}
            value={password}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        className="mt-3"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Submit
      </Button>
      <Button
        colorScheme="red"
        width={"100%"}
        className="mt-3"
        onClick={(e) => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
