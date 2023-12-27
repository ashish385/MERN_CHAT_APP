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
import React, { useState } from 'react';
import { endpoints } from "../../services/apis";

const { USER_API } = endpoints;



const Signup = () => {
  const toast = useToast();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showPass, setShowPass] = useState(false);
  const [showCoPass, setSetshowCoPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // const loaction = useNavigate();

 async function postDetails(pics) {
      console.log(pics);
      // https://api.cloudinary.com/v1_1/dgb5w2syk
      setLoading(true);
      if (pics === undefined) {
         toast({
           title: "Please select an Image!",
            // description: "We've created your account for you.",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "top",
         });
        return;
      }
      
      if (
        pics.type === "image/jpeg" ||
        pics.type === "image/png" ||
        pics.type === "image/jpg"
      ) {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "MERN_Chat-App");
        data.append("cloud_name", "dgb5w2syk");
       try {
         const res = await fetch(
           "https://api.cloudinary.com/v1_1/dgb5w2syk/image/upload",
           {
             method: "post",
             body: data,
           }
         );
         const cloudData = await res.json();
         console.log(cloudData.url);
         setPic(cloudData.url.toString())
         setLoading(false);
       } catch (error) {
         console.log(error);
         setLoading(false);
       }
        // console.log(cloudData.url.toString());
        
      } else {
        toast({
          title: "Image not upload",
          // description: "We've created your account for you.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      console.log("success");
    }

  async function handleSubmit() {
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "please fill all the field!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position:"top"
      })
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password and ConfirmPassword don't match!",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top",
      });
      return;
    }

    console.log(name, email, password, confirmPassword);
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type":"application/json",
        }
      }

      const { data } = await axios.post(`${USER_API}`, { name, email, password, pic }, config);
      console.log(data);
       toast({
         title: "Registation Successfull!",
         status: "success",
         duration: "5000",
         isClosable: true,
         position: "top",
       });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      // loaction('/chat');
    } catch (error) {
      console.log(error);
      toast({
        title: "Registation Faild!",
        status: 'warning',
        duration: "5000",
        isClosable: true,
        position:"top"
      })
    }

    }


  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name:</FormLabel>
        <Input
          type="string"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email:</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password:</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "string" : "password"}
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
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password:</FormLabel>
        <InputGroup>
          <Input
            type={showCoPass ? "string" : "password"}
            placeholder="Enter Your Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={() => setSetshowCoPass(!showCoPass)}
            >
              {!showCoPass ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" >
      <FormLabel>Upload your picture</FormLabel>
      <Input
          type='file'
          p={1.5}
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
          </FormControl>
          <Button colorScheme='blue' width={'100%'} className='mt-3' onClick={handleSubmit} isLoading={loading}>
              Submit
      </Button>
      
      {/* <Button onClick={postDetails}>click</Button> */}
    </VStack>
  );
}

export default Signup