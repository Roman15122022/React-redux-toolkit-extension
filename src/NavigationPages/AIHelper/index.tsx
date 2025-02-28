import React from 'react'

import { TypeTittle } from '../../types'
import { MoodDictionary } from '../../constants/specConstants'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useAIHelper } from './useAIHelper'

export const AIHelper = (): JSX.Element => {
  const { dates } = useAIHelper()

  if (!dates.length) {
    return (
      <Title
        variant={TypeTittle.SMALL}
        classes="mt-5 text-center"
        title="No dates"
      />
    )
  }

  return (
    <Container>
      <div className="font-semibold italic">
        Ця модель навчається на ваших данних і с кожною новою сессією стає
        точніше
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title="Прогнозований настрій"
          />
          <div>{MoodDictionary[4]}</div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title="Прогнозований час навчання"
          />
          <span className="font-semibold text-secondary-light dark:text-purple-light">
            1 час 45хв
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <Title
            classes="text-[16px]"
            variant={TypeTittle.SMALL}
            title="Прогнозований кількість сессій"
          />
          <span className="font-semibold text-secondary-light dark:text-purple-light">
            3
          </span>
        </div>
      </div>
      <div className="mt-6">
        <Title
          classes="text-[14px]"
          variant={TypeTittle.SMALL}
          title="Рекомендація від ШІ: Спробуй додати коротку перерву між сесіями (5–10 хв), щоб зберегти концентрацію. Якщо настрій стабільний, можеш трохи збільшити час навчання або змінити формат (тестування, обговорення)."
        />
      </div>
    </Container>
  )
}
