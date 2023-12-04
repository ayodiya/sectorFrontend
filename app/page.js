'use client'

import axios from 'axios'
import {
  Box,
  Button,
  VStack,
  Container,
  Stack,
  StackDivider,
  Text,
  Heading,
  useDisclosure,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import { EditIcon } from '@chakra-ui/icons'
import { ColorRing } from 'react-loader-spinner'
import { useState, useEffect } from 'react'

import AddSectorModal from '@/components/AddSectorModal'
import EditSectorModal from '@/components/EditSectorModal'

export default function Home () {
  const {
    isOpen: isOpenAddSector,
    onOpen: onOpenAddSector,
    onClose: onCloseAddSector
  } = useDisclosure()
  const {
    isOpen: isOpenEditSector,
    onOpen: onOpenEditSector,
    onClose: onCloseEditSector
  } = useDisclosure()
  const [userSectors, setUserSectors] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUserSector, setSelectedUserSector] = useState([])

  const getUserSectors = async () => {
    setLoading(true)

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}sector/user-sectors`
      )

      setUserSectors(data.userSectors)
    } catch (error) {
      Notify.failure('Server error, please try again')
    }
    setLoading(false)
  }

  useEffect(() => {
    getUserSectors()
  }, [])

  return (
    <>
      <Container maxW='lg'>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'noWrap',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh'
            }}
          >
            <ColorRing
              visible={true}
              height='80'
              width='80'
              ariaLabel='blocks-loading'
              wrapperClass='blocks-wrapper'
              colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
          </Box>
        )}
        {!loading && userSectors.length < 1 && (
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
                onClick={onOpenAddSector}
              >
                Add Sector
              </Button>
            </VStack>
          </Box>
        )}
      </Container>
      <Container maxW='1000px'>
        {!loading && userSectors.length && (
          <Box
            sx={{
              paddingTop: '100px'
            }}
          >
            <Box
              color='#dcd427'
              fontSize='20px'
              fontWeight={900}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              User Sectors
            </Box>
            <Box
              sx={{
                paddingTop: '10px',
                display: 'flex',
                justifyContent: { base: 'center', lg: 'flex-end' }
              }}
            >
              <Button
                size='lg'
                _hover={{
                  backgroundColor: '#5c7829',
                  color: 'white'
                }}
                color='white'
                backgroundColor='#5c7829'
                onClick={onOpenAddSector}
              >
                Add Sector
              </Button>
            </Box>
            <Box
              sx={{
                paddingTop: '100px'
              }}
            >
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  lg: 'repeat(3, 1fr)'
                }}
                gap={6}
              >
                {userSectors?.map((item, index) => {
                  const {
                    name,
                    sector,
                    subSector,
                    subSubSector,
                    subSubSubSector
                  } = item

                  return (
                    <GridItem key={index} w='100%'>
                      <Card
                        sx={{
                          minHeight: '400px'
                        }}
                      >
                        <CardHeader
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Heading size='md'>{name}</Heading>
                          <Box
                            onClick={() => {
                              setSelectedUserSector(item)
                              onOpenEditSector()
                            }}
                            sx={{
                              cursor: 'pointer'
                            }}
                          >
                            <EditIcon />
                          </Box>
                        </CardHeader>
                        <CardBody>
                          <Stack divider={<StackDivider />} spacing='4'>
                            <Box>
                              <Heading size='xs' textTransform='uppercase'>
                                Sector
                              </Heading>
                              <Text pt='2' fontSize='sm'>
                                {sector.sectorName}
                              </Text>
                            </Box>
                            <Box>
                              <Heading size='xs' textTransform='uppercase'>
                                Sub-Sector
                              </Heading>
                              <Text pt='2' fontSize='sm'>
                                {subSector?.subSectorName}
                              </Text>
                            </Box>
                            {subSubSector && (
                              <Box>
                                <Heading size='xs' textTransform='uppercase'>
                                  Sub-Sub-Sector
                                </Heading>
                                <Text pt='2' fontSize='sm'>
                                  {subSubSector?.subSectorName}
                                </Text>
                              </Box>
                            )}
                            {subSubSubSector && (
                              <Box>
                                <Heading size='xs' textTransform='uppercase'>
                                  Sub-Sub-Sub-Sector
                                </Heading>
                                <Text pt='2' fontSize='sm'>
                                  {subSubSubSector?.subSectorName}
                                </Text>
                              </Box>
                            )}
                          </Stack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  )
                })}
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
      <AddSectorModal
        setUserSectors={setUserSectors}
        isOpen={isOpenAddSector}
        onOpen={onOpenAddSector}
        onClose={onCloseAddSector}
      />
      <EditSectorModal
        selectedUser={selectedUserSector}
        setUserSectors={setUserSectors}
        isOpen={isOpenEditSector}
        onOpen={onOpenEditSector}
        onClose={onCloseEditSector}
      />
    </>
  )
}
