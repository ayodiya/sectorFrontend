import yup from 'yup'
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
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  HStack,
  Select,
  Checkbox
} from '@chakra-ui/react'

import addSectorValidator, {
  NAME,
  NAME_LABEL,
  SECTORS,
  SECTORS_LABEL,
  TERMS_AGREE,
  TERMS_AGREE_LABEL
} from '@/validators/addSectorValidator'

const initialValues = {
  [NAME]: '',
  [SECTORS]: '',
  [TERMS_AGREE]: ''
}

export default function AddSectorModal ({ isOpen, onOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={addSectorValidator}
            onSubmit={async (
              values,
              { isSubmitting, resetForm, setFieldError }
            ) => {
              if (!values[TERMS_AGREE]) {
                return setFieldError(TERMS_AGREE, 'You must agree to terms')
              }

              // setLoading(true)

              // try {
              //   const { data } = await axios.post(
              //   `${process.env.REACT_APP_PROD_MODE === 'test'
              //     ? process.env.REACT_APP_API_URL_TEST
              //     : process.env.REACT_APP_API_URL_LIVE}/contact`,
              //   { ...values }
              //   )

              //   Notify.success(data.message)
              // } catch (error) {
              //   Notify.failure(error.response.data.msg)
              // }
              // setLoading(false)
              resetForm()
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
                      name={NAME}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      errorBorderColor='red'
                      type='text'
                      color='black'
                    />
                    <FormHelperText color='red'>{errors[NAME]}</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel color='black'>{SECTORS_LABEL}</FormLabel>
                    <Select
                      name={SECTORS}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      color='black'
                      placeholder='Select option'
                    >
                      <option value='option1'>Option 1</option>
                      <option value='option2'>Option 2</option>
                      <option value='option3'>Option 3</option>
                    </Select>
                    <FormHelperText color='red'>
                      {errors[SECTORS]}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Checkbox
                      onBlur={handleBlur}
                      onChange={
                        e => setFieldValue(TERMS_AGREE, e.target.checked)
                        // console.log('this is ghosred', e.target.checked)
                      }
                      name={TERMS_AGREE}
                      color='black'
                      onBlur={handleBlur}
                    >
                      Agree to terms
                    </Checkbox>
                    <FormHelperText color='red'>
                      {errors[TERMS_AGREE]}
                    </FormHelperText>
                  </FormControl>
                  <HStack>
                    <Button type='submit' colorScheme='blue' mr={3}>
                      Submit
                    </Button>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
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
    </Modal>
  )
}
