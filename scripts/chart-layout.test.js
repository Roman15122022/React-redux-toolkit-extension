const assert = require('node:assert/strict')
const test = require('node:test')
const typescript = require('typescript')

function transpileTypeScript(module, filename) {
  const source = require('node:fs').readFileSync(filename, 'utf8')
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: typescript.JsxEmit.React,
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2021,
    },
    fileName: filename,
  }).outputText

  module._compile(output, filename)
}

require.extensions['.ts'] = transpileTypeScript
require.extensions['.tsx'] = transpileTypeScript

test('keeps the full activity name available in the pie chart legend', () => {
  const React = require('react')
  const ReactDOMServer = require('react-dom/server')
  const hookModulePath = require.resolve(
    '../src/features/PieChartActivities/usePieChartActivities',
  )
  const componentModulePath = require.resolve(
    '../src/features/PieChartActivities',
  )
  const originalHookModule = require.cache[hookModulePath]

  require.cache[hookModulePath] = {
    exports: {
      usePieChartActivities: () => ({
        colorText: 'white',
        valueActivity: [
          {
            color: '#08b7b3',
            id: 0,
            label: 'English conversation practice with a tutor',
            value: 100,
          },
        ],
      }),
    },
  }
  delete require.cache[componentModulePath]

  try {
    const { PieChartActivities } = require(componentModulePath)
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PieChartActivities, {
        dates: [],
        setIsActivityFilterVisible: () => {},
      }),
    )

    assert.match(markup, /role="list"/)
    assert.match(markup, /pb-4/)
    assert.match(markup, /title="English conversation practice with a tutor"/)
  } finally {
    delete require.cache[componentModulePath]

    if (originalHookModule) {
      require.cache[hookModulePath] = originalHookModule
    } else {
      delete require.cache[hookModulePath]
    }
  }
})

test('keeps the full mood name available in the pie chart legend', () => {
  const React = require('react')
  const ReactDOMServer = require('react-dom/server')
  const hookModulePath = require.resolve(
    '../src/features/PieChartMood/usePieChartMood',
  )
  const componentModulePath = require.resolve('../src/features/PieChartMood')
  const originalHookModule = require.cache[hookModulePath]

  require.cache[hookModulePath] = {
    exports: {
      usePieChartMood: () => ({
        colorNeutral: '#9e9e9e',
        colorText: 'white',
        locale: {
          veryDissatisfied: 'Very dissatisfied with the session',
          dissatisfied: 'Dissatisfied',
          neutral: 'Neutral',
          satisfied: 'Satisfied',
          verySatisfied: 'Very satisfied',
        },
        valueMoods: [0, 1, 2, 3, 4, 5],
      }),
    },
  }
  delete require.cache[componentModulePath]

  try {
    const { PieChartMood } = require(componentModulePath)
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(PieChartMood, { dates: [] }),
    )

    assert.match(markup, /role="list"/)
    assert.match(markup, /title="Very dissatisfied with the session"/)
  } finally {
    delete require.cache[componentModulePath]

    if (originalHookModule) {
      require.cache[hookModulePath] = originalHookModule
    } else {
      delete require.cache[hookModulePath]
    }
  }
})
