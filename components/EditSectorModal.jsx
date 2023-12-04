import yup from 'yup'
import axios from 'axios'
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import { Formik } from 'formik'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  HStack,
  Select,
  Checkbox,
  Box
} from '@chakra-ui/react'
import { useEffect, useState, useCallback } from 'react'

import editSectorValidator, {
  NAME,
  NAME_LABEL,
  SECTOR,
  SECTOR_LABEL,
  SUB_SECTOR,
  SUB_SECTOR_LABEL,
  SUB_SUB_SECTOR,
  SUB_SUB_SECTOR_LABEL,
  SUB_SUB_SUB_SECTOR,
  SUB_SUB_SUB_SECTOR_LABEL
} from '@/validators/editSectorValidator'

export default function EditSectorModal ({
  isOpen,
  onOpen,
  onClose,
  setUserSectors,
  selectedUser
}) {
  const [loading, setLoading] = useState(false)
  const [sectors, setSectors] = useState([])
  const [subSectors, setSubSectors] = useState([])
  const [selectedSectorName, setSelectedSectorName] = useState('')
  const [subSubSectors, setSubSubSectors] = useState([])
  const [subSubSubSectors, setSubSubSubSectors] = useState([])
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedSubSector, setSubSelectedSector] = useState('')
  const [selectedSubSubSector, setSubSubSelectedSector] = useState('')
  const [selectedSubSubSubSector, setSubSubSubSelectedSector] = useState('')

  const getSectors = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}sector/sectors`
      )

      setSectors(data.sectors)
    } catch (error) {
      Notify.failure('Server error, please reload the page')
    }
  }

  const getSubSectors = async (parentId, subSectorType) => {
    setLoading(true)

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}sector/sub-sectors/${parentId}`
      )

      if (subSectorType === 'subSector') {
        setSubSectors(data.subSectors)
      } else if (subSectorType === 'subSubSector') {
        setSubSubSectors(data.subSectors)
      } else if (subSectorType === 'subSubSubSector') {
        setSubSubSubSectors(data.subSectors)
      }
    } catch (error) {
      Notify.failure('Server error, please reload the page')
    }
    setLoading(false)
  }

  const getInitialSubSectors = async selectedUser => {
    setLoading(true)

    try {
      const subSector = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}sector/sub-sectors/${selectedUser.subSector?.parentId}`
      )

      setSubSectors(subSector.data.subSectors)

      if (selectedUser.subSubSector?.parentId) {
        const subSubSector = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}sector/sub-sectors/${selectedUser.subSubSector?.parentId}`
        )
        setSubSubSectors(subSubSector.data.subSectors)
      }

      if (selectedUser.subSubSubSector?.parentId) {
        const subSubSubSector = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}sector/sub-sectors/${selectedUser.subSubSubSector?.parentId}`
        )
        setSubSubSubSectors(subSubSubSector.data.subSectors)
      }
    } catch (error) {
      Notify.failure('Server error, please reload the page')
    }
    setLoading(false)
  }

  useEffect(() => {
    getSectors()
    getInitialSubSectors(selectedUser)
  }, [isOpen])

  const getSectorsDetails = (id, sectors) => {
    const index = sectors.findIndex(item => item._id === id)

    return sectors[index]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='black'>Edit Sector</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              [NAME]: selectedUser.name,
              [SECTOR]: selectedUser.sector?.sectorName,
              [SUB_SECTOR]: selectedUser.subSector?.subSectorName,
              [SUB_SUB_SECTOR]: selectedUser.subSubSector?.subSectorName,
              [SUB_SUB_SUB_SECTOR]: selectedUser.subSubSubSector?.subSectorName
            }}
            validationSchema={editSectorValidator}
            onSubmit={async (
              values,
              { isSubmitting, resetForm, setErrors, errors }
            ) => {
              if (
                values.subSector === '' &&
                sectors.some(
                  item => item._id === values.sector && item.hasSubSector
                )
              ) {
                return setErrors({
                  [SUB_SECTOR]: 'Please select an option'
                })
              } else if (
                values.subSubSector === '' &&
                subSectors.some(
                  item => item._id === values.subSector && item.hasSubSector
                )
              ) {
                return setErrors({
                  [SUB_SUB_SECTOR]: 'Please select an option'
                })
              } else if (
                values.subSubSubSector === '' &&
                subSubSectors.some(
                  item => item._id === values.subSubSector && item.hasSubSector
                )
              ) {
                return setErrors({
                  [SUB_SUB_SUB_SECTOR]: 'Please select an option'
                })
              }

              const dataToSubmit = {
                name: values?.name,
                sector: await getSectorsDetails(values?.sector, sectors),
                subSector: await getSectorsDetails(
                  values?.subSector,
                  subSectors
                ),
                subSubSector: await getSectorsDetails(
                  values?.subSubSector,
                  subSubSectors
                ),
                subSubSubSector: await getSectorsDetails(
                  values?.subSubSubSector,
                  subSubSubSectors
                )
              }

              try {
                await axios.put(
                  `${process.env.NEXT_PUBLIC_URL}sector/edit-user-sector/${selectedUser?._id}`,
                  {
                    ...dataToSubmit
                  }
                )

                const { data } = await axios.get(
                  `${process.env.NEXT_PUBLIC_URL}sector/user-sectors`
                )

                Notify.success('Sector added successfully')
                setUserSectors(data.userSectors)
                onClose()
              } catch (error) {
                Notify.failure('Server error, please reload the page')
              }
            }}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
              handleBlur,
              setFieldError,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl isInvalid={errors[NAME] !== undefined}>
                    <FormLabel color='black'>{NAME_LABEL}</FormLabel>
                    <Input
                      value={values[NAME]}
                      name={NAME}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      errorBorderColor='red'
                      type='text'
                      color='black'
                      placeholder='Full Name'
                    />
                    <FormHelperText color='red'>{errors[NAME]}</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel color='black'>{SECTOR_LABEL}</FormLabel>
                    <Select
                      name={SECTOR}
                      onBlur={handleBlur}
                      onChange={e => {
                        const index = sectors.findIndex(
                          item => item.sectorName === e.target.value
                        )
                        setSelectedSector({
                          sectorIndex: index,
                          sectorName: e.target.value
                        })

                        setFieldValue(SECTOR, sectors[index]?._id)

                        getSubSectors(sectors[index]?._id, 'subSector')
                      }}
                      color='black'
                      placeholder='Select option'
                    >
                      {sectors.map((item, index) => (
                        <option
                          selected={
                            selectedUser.sector?.sectorName === item?.sectorName
                          }
                          key={index}
                          value={item?.sectorName}
                        >
                          {item?.sectorName}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText color='red'>
                      {errors[SECTOR]}
                    </FormHelperText>
                  </FormControl>
                  {(sectors[selectedSector?.sectorIndex]?.hasSubSector ||
                    selectedUser.subSector?.subSectorName !== undefined) &&
                    !loading && (
                      <FormControl>
                        <FormLabel color='black'>{SUB_SECTOR_LABEL}</FormLabel>
                        <Select
                          name={SUB_SECTOR}
                          value={
                            selectedSubSector.sectorName !== ''
                              ? selectedSubSector.sectorName
                              : values[SUB_SECTOR]
                          }
                          onBlur={handleBlur}
                          onChange={e => {
                            const index = subSectors.findIndex(
                              item => item.subSectorName === e.target.value
                            )
                            setSubSelectedSector({
                              sectorIndex: index,
                              sectorName: e.target.value
                            })

                            setFieldValue(SUB_SECTOR, subSectors[index]?._id)

                            getSubSectors(
                              subSectors[index]?._id,
                              'subSubSector'
                            )
                          }}
                          color='black'
                          placeholder='Select option'
                        >
                          {subSectors.map((item, index) => (
                            <option
                              selected={
                                selectedUser.subSector?.subSectorName ===
                                item?.subSectorName
                              }
                              key={index}
                              value={item.subSectorName}
                            >
                              {item?.subSectorName}
                            </option>
                          ))}
                        </Select>
                        <FormHelperText color='red'>
                          {errors[SUB_SECTOR]}
                        </FormHelperText>
                      </FormControl>
                    )}
                  {(subSectors[selectedSubSector?.sectorIndex]?.hasSubSector ||
                    selectedUser.subSubSector?.subSectorName !== undefined) && (
                    <FormControl>
                      <FormLabel color='black'>
                        {SUB_SUB_SECTOR_LABEL}
                      </FormLabel>
                      <Select
                        disabled={loading}
                        name={SUB_SUB_SECTOR}
                        onBlur={handleBlur}
                        onChange={e => {
                          const index = subSubSectors.findIndex(
                            item => item.subSectorName === e.target.value
                          )
                          setSubSubSelectedSector({
                            sectorIndex: index,
                            sectorName: e.target.value
                          })

                          setFieldValue(
                            SUB_SUB_SECTOR,
                            subSubSectors[index]?._id
                          )

                          getSubSectors(
                            subSubSectors[index]?._id,
                            'subSubSubSector'
                          )
                        }}
                        color='black'
                        placeholder='Select option'
                      >
                        {subSubSectors.map((item, index) => (
                          <option
                            selected={
                              selectedUser.subSubSector?.subSectorName ===
                              item?.subSectorName
                            }
                            key={index}
                            value={item.subSectorName}
                          >
                            {item?.subSectorName}
                          </option>
                        ))}
                      </Select>
                      <FormHelperText color='red'>
                        {errors[SUB_SUB_SECTOR]}
                      </FormHelperText>
                    </FormControl>
                  )}
                  {(subSectors[selectedSubSector?.sectorIndex]?.hasSubSector ||
                    selectedUser.subSubSubSector?.subSectorName !==
                      undefined) && (
                    <FormControl>
                      <FormLabel color='black'>
                        {SUB_SUB_SUB_SECTOR_LABEL}
                      </FormLabel>
                      <Select
                        name={SUB_SUB_SUB_SECTOR}
                        onBlur={handleBlur}
                        onChange={e => {
                          const index = subSubSubSectors.findIndex(
                            item => item.subSectorName === e.target.value
                          )
                          setSubSubSubSelectedSector({
                            sectorIndex: index,
                            sectorName: e.target.value
                          })

                          setFieldValue(
                            SUB_SUB_SUB_SECTOR,
                            subSubSubSectors[index]?._id
                          )
                        }}
                        color='black'
                        placeholder='Select option'
                      >
                        {subSubSubSectors.map((item, index) => (
                          <option
                            selected={
                              selectedUser.subSubSubSector?.subSectorName ===
                              item?.subSectorName
                            }
                            key={index}
                            value={item.subSectorName}
                          >
                            {item?.subSectorName}
                          </option>
                        ))}
                      </Select>
                      <FormHelperText color='red'>
                        {errors[SUB_SUB_SUB_SECTOR]}
                      </FormHelperText>
                    </FormControl>
                  )}
                  <HStack>
                    <Button
                      isLoading={isSubmitting}
                      loadingText='Submitting'
                      type='submit'
                      colorScheme='blue'
                      mr={3}
                    >
                      Submit
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      colorScheme='red'
                      mr={3}
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </HStack>
                </VStack>
              </form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
      {/* )} */}
    </Modal>
  )
}
