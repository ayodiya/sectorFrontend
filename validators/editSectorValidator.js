import * as Yup from 'yup'

export const NAME = 'name'
export const NAME_LABEL = 'Name'

export const SECTOR = 'sector'
export const SECTOR_LABEL = 'Sector'

export const SUB_SECTOR = 'subSector'
export const SUB_SECTOR_LABEL = 'Sub-Sector'

export const SUB_SUB_SECTOR = 'subSubSector'
export const SUB_SUB_SECTOR_LABEL = 'Sub-Sub-Sector'

export const SUB_SUB_SUB_SECTOR = 'subSubSubSector'
export const SUB_SUB_SUB_SECTOR_LABEL = 'Sub-Sub-Sub-Sector'

export default Yup.object({
  [NAME]: Yup.string().label(NAME_LABEL).required(),
  [SECTOR]: Yup.string().label(SECTOR_LABEL).required(),
  [SUB_SECTOR]: Yup.string().label(SUB_SECTOR_LABEL).optional(),
  [SUB_SUB_SECTOR]: Yup.string().label(SUB_SUB_SECTOR_LABEL).optional(),
  [SUB_SUB_SUB_SECTOR]: Yup.string().label(SUB_SUB_SUB_SECTOR_LABEL).optional()
})
