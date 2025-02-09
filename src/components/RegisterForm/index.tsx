import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Center,
  Input,
  Link,
  Stack,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { UserLoginProps } from "../../types";
import { useCookies } from "react-cookie";
// import { menApiAuthClient } from "../../clients/mentumm";
import axios from "axios";
import { mixpanelEvent, mixpanelIdentify, mixpanelPeople } from "../../helpers";

const NODE_API = process.env.REACT_APP_NODE_API;

const RegisterForm: React.FC<UserLoginProps> = (props) => {
  const [email, setEmail] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [userFirstName, setUserFirstName] = useState<string>(null);
  const [userLastName, setUserLastName] = useState<string>(null);
  const [inviteCode, setInviteCode] = useState<string>(null);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [userFirstNameError, setUserFirstNameError] = useState<boolean>(false);
  const [userLastNameError, setUserLastNameError] = useState<boolean>(false);
  const [inviteCodeError, setInviteCodeError] = useState<boolean>(false);
  const [, setCookie] = useCookies();
  const userRole = inviteCode === "Coach10Register23" ? "coach" : "user";

  const validateEmail = () => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(e.target.value === "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value === "");
  };

  const handleUserFirstNameChange = (e) => {
    setUserFirstName(e.target.value);
    setUserFirstNameError(e.target.value === "");
  };

  const handleUserLastNameChange = (e) => {
    setUserLastName(e.target.value);
    setUserLastNameError(e.target.value === "");
  };

  const handleInviteCodeChange = (e) => {
    setInviteCode(e.target.value);
    setInviteCodeError(e.target.value === "");
  };

  const handleAPICreds = async (email: string, password: string) => {
    try {
      const tokenResponse = await axios.post(`${NODE_API}/v1/token/generate`, {
        email,
        password,
      });
      if (!tokenResponse || !tokenResponse.data) {
        throw new Error(
          `[Could not get API Token]: ${tokenResponse.statusText}`
        );
      }
      return tokenResponse.data;
    } catch (error) {
      console.error(error);
    }
  };

  const login = async () => {
    setEmailError(!email || email === "" || !validateEmail());
    setPasswordError(!password || password === "");
    setInviteCodeError(!inviteCode || inviteCode === "");
    setUserFirstNameError(!userFirstName || userFirstName === "");
    setUserLastNameError(!userLastName || userLastName === "");

    if (
      !email ||
      email === "" ||
      password === "" ||
      !password ||
      userFirstName === "" ||
      !userFirstName ||
      userLastName === "" ||
      !userLastName ||
      inviteCode === "" ||
      !inviteCode
    ) {
      return;
    }

    try {
      const createUser = await axios.post(
        `${NODE_API}/v1/${userRole}/register`,
        {
          email: email,
          password: password,
          invite_code: inviteCode,
          first_name: userFirstName,
          last_name: userLastName,
        }
      );

      if (!createUser) {
        throw Error("Unable to login");
      }

      switch (createUser.data.message) {
        case "User email address is already being used":
          setEmailError(true);
          return;
        case "Invitation Code not found!":
          setInviteCodeError(true);
          return;
        case "Invalid Invite Code!":
          setInviteCodeError(true);
          return;
      }

      const userData = createUser.data[0];
      const cookieData = {
        id: Number(userData.id),
      };

      const token = await handleAPICreds(email, password);

      setCookie("growth_10_token", token, {
        path: "/",
        secure: true,
        expires: new Date(Date.now() + 3600 * 1000 * 48),
        sameSite: true,
      });
      mixpanelIdentify(String(createUser.data[0].id)); // sets user id
      mixpanelPeople(createUser.data[0]); // sets user profile
      mixpanelEvent("New User Registered", {
        "User ID": createUser.data[0].id,
        "First Name": createUser.data[0].first_name,
        "Last Name": createUser.data[0].last_name,
        "Employer ID": createUser.data[0].employer_id,
        Email: createUser.data[0].email,
        Role: createUser.data[0].role,
      });

      setCookie("growth_10_03142023", cookieData, {
        path: "/",
        secure: true,
        expires: new Date(Date.now() + 3600 * 1000 * 48),
        sameSite: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container mt="25em" maxW="lg" centerContent position="absolute">
      <Stack>
        <Flex justifyContent="center" mb={12}>
          <Heading colorScheme="brand" color="brand.400">New Member</Heading>
          <Heading fontWeight="400" ml={2} color="white">Registration</Heading>
        </Flex>
        <Container maxW="md" px={6} id="PLUMBUS">
          <Stack spacing="6" >
            <Stack spacing={4} >
              <FormControl id="firstName" isInvalid={userFirstNameError}>
                <FormLabel srOnly>First Name</FormLabel>
                <Input
                  name="first_name"
                  placeholder="First Name"
                  onChange={handleUserFirstNameChange}
                />
                {!userFirstNameError ? null : (
                  <FormErrorMessage style={{ marginBottom: "6px" }}>
                    Your first name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="lastName" isInvalid={userLastNameError}>
                <FormLabel srOnly>Last Name</FormLabel>
                <Input
                  name="last_name"
                  placeholder="Last Name"
                  onChange={handleUserLastNameChange}
                  mb={1}
                />
                <Divider py={2} maxWidth="85%" mx="auto" />
                {!userLastNameError ? null : (
                  <FormErrorMessage style={{ marginBottom: "6px" }}>
                    Your last name is required.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="email" isInvalid={emailError}>
                <FormLabel srOnly>Email address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  mt={1}
                  onChange={handleEmailChange}
                />
                {emailError && (
                  <FormErrorMessage style={{ marginBottom: "6px" }}>
                    {`A ${userRole} with that email address already exists.`}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="password" isInvalid={passwordError}>
                <FormLabel srOnly>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  mb={1}
                  onChange={handlePasswordChange}
                />
                <Divider py={2} maxWidth="85%" mx="auto" />
                {!passwordError ? null : (
                  <FormErrorMessage>Password is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl id="invite-code" isInvalid={inviteCodeError}>
                <FormLabel srOnly>Invitation Code</FormLabel>
                <Input
                  name="invite"
                  placeholder="Invitation Code"
                  mt={1}
                  onChange={handleInviteCodeChange}
                />
                {!inviteCodeError ? null : (
                  <FormErrorMessage style={{ marginBottom: "6px" }}>
                    Something went wrong with your invitation code.
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>

            <Stack spacing="4">
              <Button
                type="submit"
                mt="2"
                variant="onBlue"
                size="md"
                onClick={() => login()}>
                Register
              </Button>
              <Center>
                <Text color="white" fontSize="xs" textAlign="center">
                  By signing up you are agreeing to the{" "}
                  <Link
                    href="https://mentumm.com/coaching-terms-and-conditions/"
                    isExternal
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and to receive personalized commercial communication.
                </Text>
              </Center>
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </Container>
  );
};

export default RegisterForm;
