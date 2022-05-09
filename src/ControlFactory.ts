import { ControlData } from 'types/ControlData'
import { ControlBinary } from 'entities/controls/ControlBinary'
import { ControlCheckbox } from 'entities/controls/ControlCheckbox'
import { ControlDate } from 'entities/controls/ControlDate'
import { ControlNumeric } from 'entities/controls/ControlNumeric'
import { ControlSelect } from 'entities/controls/ControlSelect'
import { ControlSelectMultiple } from 'entities/controls/ControlSelectMultiple'
import { ControlText } from 'entities/controls/ControlText'
import { ControlReference } from 'entities/controls/ControlReference'
import { Config as OcaJsConfig } from 'OcaJs'
import { createStructure } from 'use_cases/createStructure'
import axios from 'axios'

export class ControlFactory {
  static async getControl(
    type: string,
    data: ControlData,
    config: OcaJsConfig
  ) {
    if (typeof data.entryCodes == 'string') {
      try {
        const result = await Promise.race(
          config.dataVaults.map(dataVaultUrl =>
            axios.get(`${dataVaultUrl}/${data.entryCodes}`)
          )
        )
        if (result.data.errors) {
          throw result.data.errors
        }
        data.entryCodes = result.data
      } catch {
        data.entryCodes = []
      }
    }
    for (const translation of Object.values(data.translations)) {
      if (typeof translation.entries == 'string') {
        try {
          const result = await Promise.race(
            config.dataVaults.map(dataVaultUrl =>
              axios.get(`${dataVaultUrl}/${translation.entries}`)
            )
          )
          if (result.data.errors) {
            throw result.data.errors
          }
          translation.entries = result.data
        } catch {
          translation.entries = {}
        }
      }
    }

    if (type === 'Text') {
      if (data.entryCodes) {
        return new ControlSelect(data)
      } else {
        return new ControlText(data)
      }
    } else if (type === 'Array[Text]') {
      if (data.entryCodes) {
        return new ControlSelectMultiple(data)
      } else {
        return new ControlText(data)
      }
    } else if (type === 'Binary' || type === 'Array[Binary]') {
      return new ControlBinary(data)
    } else if (type === 'Numeric' || type === 'Array[Numeric]') {
      return new ControlNumeric(data)
    } else if (type === 'Boolean' || type === 'Array[Boolean]') {
      return new ControlCheckbox(data)
    } else if (type === 'Date' || type === 'Array[Date]') {
      return new ControlDate(data)
    } else if (type.startsWith('SAI:') || type.startsWith('Array[SAI:')) {
      if (data.sai) {
        try {
          const result = await Promise.race(
            config.ocaRepositories.map(ocaRepositoryUrl =>
              axios.get(`${ocaRepositoryUrl}/${data.sai}`)
            )
          )
          data.reference = await createStructure(result.data, config)
        } catch {
          data.reference = null
        }
      }
      return new ControlReference(data)
    }
  }
}
