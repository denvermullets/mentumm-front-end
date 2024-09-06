import { Flex, VStack, Heading, Spacer, Avatar, Text, Divider, Box } from '@chakra-ui/react';
import React from 'react';
import { CurrentUser } from '../../../types';

type SideContentHeaderProps = {
  currentUser: CurrentUser
}

const SideContentHeader = ({ currentUser }: SideContentHeaderProps) => {
  const userDisplayName = `${currentUser?.first_name} ${currentUser?.last_name[0]}.`

  return (
    <Box mx='1em' >
      <Flex mt='3em' mb='1em'>
        <VStack justifyContent='center' >
          <Heading size='md' color='#2CBBBC'>
            {userDisplayName}
          </Heading>
          <Text size='md' color='#3067B0'>
            Logout
          </Text>
        </VStack>
        <Spacer />
        <Avatar size='xl' name={userDisplayName} />
      </Flex >
      <Divider borderBottomColor='#002F6F' />
    </Box >
  )
}

export default SideContentHeader;