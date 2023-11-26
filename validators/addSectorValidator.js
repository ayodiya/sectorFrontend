import * as Yup from 'yup'

export const NAME = 'name'
export const NAME_LABEL = 'Name'

export const SECTORS = 'sectors'
export const SECTORS_LABEL = 'Sectors'

export const TERMS_AGREE = 'termsAgree'
export const TERMS_AGREE_LABEL = 'Agree to terms'

export default Yup.object({
  [NAME]: Yup.string().label(NAME_LABEL).required(),
  [SECTORS]: Yup.string().label(SECTORS_LABEL).required(),
  [TERMS_AGREE]: Yup.boolean().label(TERMS_AGREE_LABEL).required()
})
