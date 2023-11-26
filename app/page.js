'use client'

import Image from 'next/image'
import {
  Box,
  Button,
  VStack,
  Modal,
  Container,
  useDisclosure
} from '@chakra-ui/react'

import AddSectorModal from '@/components/AddSectorModal'

export default function Home () {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Container maxW='lg'>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'noWrap',
            minHeight: '100vh'
          }}
        >
          <VStack>
            <Box
              color='#dcd427'
              fontSize='20px'
              fontWeight={900}
              textAlign='center'
            >
              You have not selected the sector you currently work
            </Box>
            <Button
              size='lg'
              _hover={{
                backgroundColor: '#5c7829',
                color: 'white'
              }}
              color='white'
              backgroundColor='#5c7829'
              onClick={onOpen}
            >
              Add Sector
            </Button>
          </VStack>
        </Box>
      </Container>
      <AddSectorModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  )
}
