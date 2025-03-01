import React from 'react'

import { TypeTittle } from '../../types'
import Title from '../../components/Title'
import Container from '../../components/Container'

import { useAIHelper } from './useAIHelper'

export const AIHelper = (): JSX.Element => {
  const { locale, dates, isModelLoading, predictionsFields } = useAIHelper()

  if (!dates.length) {
    return (
      <Title
        variant={TypeTittle.SMALL}
        classes="mt-5 text-center"
        title={locale.noData}
      />
    )
  }

  return (
    <Container>
      <span className="font-semibold italic">{locale.titleInfo}</span>
      <div className="mt-6">
        {isModelLoading && (
          <div className="mt-3 text-secondary-light dark:text-purple-light">
            {locale.isTraining}
          </div>
        )}

        <div>
          {predictionsFields.map(({ id, title, value }) => {
            return (
              <div key={id} className="flex items-center justify-between mt-3">
                <Title
                  classes="text-[16px]"
                  variant={TypeTittle.SMALL}
                  title={title}
                />
                {id === 'mood' ? (
                  value
                ) : (
                  <span className="font-semibold text-secondary-light dark:text-purple-light">
                    {value}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-6">
        <Title
          classes="text-[14px]"
          variant={TypeTittle.SMALL}
          title={`${locale.recomendFromAI}: Спробуй додати коротку перерву між сесіями (5–10 хв), щоб зберегти концентрацію. Якщо настрій стабільний, можеш трохи збільшити час навчання або змінити формат (тестування, обговорення).`}
        />
      </div>
    </Container>
  )
}
