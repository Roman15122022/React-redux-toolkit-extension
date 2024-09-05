import { useState } from 'react'
import { useAppSelector } from '../useAppSelector'
import { useAppDispatch } from '../useAppDispatch'
import { settingSlice } from '../../store/reducers/settingReducer/SettingSlice'
import { TRANSLATIONS } from './constants'
import { Language } from '../../types'
import { Locale } from '../../types'

export const useTranslate = () => {
  const { language } = useAppSelector(state => state.SettingReducer)
  const dispatch = useAppDispatch()
  const { setLocale } = settingSlice.actions

  const [interfaceLang, setInterfaceLang] = useState<Locale>(
    TRANSLATIONS[language],
  )

  function handleChangeLocale(locale: Language) {
    dispatch(setLocale(locale))
    setInterfaceLang(TRANSLATIONS[locale])
  }

  return { interfaceLang, handleChangeLocale, language }
}
