# #58 — Daily and Weekly Study Goals Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` for sequential execution or `superpowers:subagent-driven-development` if the user selects delegation. Track completion with the checkboxes below. The user approved execution on 2026-09-29. Implementation and verification results are recorded at the end of this plan.

**Goal:** Добавить управление дневными, недельными и недельными целями по занятиям, общий прогресс и детерминированный план оставшейся недели.

**Architecture:** Конфигурация целей хранится внутри существующего `SettingReducer` с его отдельным persistence и синхронизацией. Прогресс, серии и план вычисляются из `TimerLogsReducer.dates`, без сохранения копий результатов. Общие функции и hook используются в popup, Side Panel, Statistics и History.

**Tech Stack:** React 18, TypeScript, Redux Toolkit, redux-persist, TailwindCSS, существующие компоненты, Node test runner. Новые зависимости не нужны.

**Spec:** [GitHub issue #58](https://github.com/Roman15122022/React-redux-toolkit-extension/issues/58). Решения, которых нет в issue, перечислены ниже как предложения для согласования.

## Global Constraints

- Все расчёты локальные, без backend, облачной синхронизации и обязательной AI-модели.
- Официальный прогресс — только завершённые сессии; отмена не добавляет прогресс.
- EN/UA, светлая и тёмная темы, компактный popup 400px и Side Panel.
- Сохранить текущие настройки, историю, управление таймером и существующие достижения.
- Не менять защищённые ветки, не добавлять зависимости, комментарии в код, посторонний рефакторинг или generated artifacts.
- Проверки через Yarn и существующий подход `node --test` с transpilation TypeScript.

## Проверенная исходная реализация

- Активна ветка `58-add-daily-and-weekly-study-goals`; на момент подготовки плана дерево чистое.
- `SettingReducer.dailyGoalMinutes` уже существует, default 60; редактор разрешает 1–1440 минут.
- `DailyGoalSetting` подключён в Settings. Дневной прогресс есть только в Side Panel.
- `getDailyGoalProgress` сейчас добавляет время незавершённого таймера. Это расходится с #58: заменить расчёт и обновить соответствующий тест.
- `getStudyStreak` в Statistics считает дни занятий и допускает один пропуск на серию. Сохранить эту семантику.
- Настройки и сессии уже имеют отдельные persisted slices и синхронизацию через storage events.
- У занятий нет стабильного ID: сессии содержат только `activityName`.
- Import/export переносит Redux state; merge сохраняет текущие настройки. Учесть новые поля, не менять эту политику.
- История ограничена приблизительно 3000 сессиями. Серии и прогресс доступны в пределах сохранённой истории; не обещать бессрочный рекорд.

## Предлагаемые продуктовые решения

1. Один общий дневной и один общий недельный target плюс произвольные недельные цели по занятиям. Для каждого доступны создание, изменение, отключение и удаление; отключение сохраняет настройки, удаление убирает цель.
2. Существующую дневную цель мигрировать в новую конфигурацию, сохранив пользовательское значение; для нового пользователя оставить 60 минут. Недельные цели не создавать автоматически.
3. Неделя — понедельник–воскресенье в текущем локальном часовом поясе. Всё время сессии относится к дню её завершения, как в существующей дневной цели и серии. Переезд в другой timezone пересчитывает календарную группировку.
4. Серию продолжает любой день с положительной завершённой сессией, независимо от достижения target. Изменение цели не переписывает серию. Один прощённый пропуск остаётся; отдельный календарь recovery days не нужен для первой реализации.
5. Для планирования пользователь задаёт дни занятий и максимальное число минут в день. Предложение по default: все дни и 180 минут; это предел нагрузки, а не дневная цель.
6. Rename цели меняет её подпись и добавляет новое имя в список связанных имён занятий, сохраняя старое. Историю не переписывать. Совпадения после trim учитываются, регистр сохраняется; пересекающиеся имена двух activity goals запрещены.
7. Предстоящие milestones: завершение дневного/недельного target и ближайшая отметка серии 7, 14, 30 дней. Текущие lifetime achievements остаются без изменения.
8. При завершении сессии — компактное сообщение в SessionSummary о впервые пересечённом target. Без модального окна, уведомлений Chrome и конфетти. После reload показывать обычный completed state, не повторять анимацию события.

## Review Focus

- Popup и Side Panel открыты одновременно: завершённая сессия и изменения цели отражаются на обоих экранах; обычный timer tick не перетирает настройки.
- DST, полночь и граница недели: календарные интервалы строятся через локальные даты, а не прибавление фиксированных 24 часов.
- Rename и длинные имена: старые занятия продолжают учитываться; разные занятия не объединяются неявно.
- Несовместимые цели и лимиты: план не дублирует время и явно сообщает незапланированный остаток.
- Старый backup, повреждённые значения и удалённая цель: миграция не возвращает удалённый target и не сбрасывает другие настройки.

## Task 1: Конфигурация, миграция и сохранение

**Files:**

- Create: `src/features/StudyGoals/types.ts`, `constants.ts`, `configuration.ts`.
- Modify: `src/store/reducers/settingReducer/types.ts`, `SettingSlice.ts`, `src/store/settingPersistence.ts`.
- Modify: `src/features/DataTransfer/helpers.ts`, при необходимости `useDataTransfer.ts`.
- Test: `scripts/study-goals.test.js`, `scripts/store-persistence.test.js`, `package.json`.

**Interfaces:**

- `StudyGoal`: `id`, `kind: 'daily-total' | 'weekly-total' | 'weekly-activity'`, `targetMinutes`, `enabled`, `activityNames: string[]` (пустой список для total goals).
- `StudyGoalsConfiguration`: `version: 1`, `goals: StudyGoal[]`, `studyWeekdays: number[]` (JS weekdays 0–6), `maxDailyMinutes`.
- `normalizeStudyGoalsConfiguration(value: unknown, legacyDailyGoalMinutes?: number): StudyGoalsConfiguration`.
- `Setting.studyGoals` — единственный источник настройки; legacy `dailyGoalMinutes` используется только для миграции.
- Actions: `saveStudyGoal`, `setStudyGoalEnabled`, `deleteStudyGoal`, `setStudyPlanningLimits` с типизированными payload.

- [x] Добавить failing tests: legacy 90 минут сохраняется; повторная миграция идемпотентна; пустой новый `goals` остаётся пустым после reload; target 0/NaN/Infinity отклоняется; прочие settings сохраняются.
- [x] Запустить `node --test scripts/study-goals.test.js` и подтвердить ожидаемый fail.
- [x] Реализовать нормализацию и actions: целые дневные минуты 1–1440, недельные 1–10080, maxDailyMinutes 1–1440; не более одной цели каждого total kind; activity aliases не пересекаются. Пустой список дней разрешён и означает отсутствие доступных дней.
- [x] Мигрировать уже сохранённый `persist:setting` и fallback из `persist:root`; наличие конфигурации version 1 важнее legacy поля, даже при пустом goals.
- [x] Валидировать новые поля import/export; replace принимает импортированные goals, старый backup мигрируется, merge сохраняет текущие goals и limits.
- [x] Проверить два реальных Redux stores: изменение настройки и новая сессия синхронизируются, timer tick не откатывает goals. Проверить export → replace и legacy import.
- [x] Запустить persistence tests и `yarn test:store`; commit `feat: #58 persist study goal configuration` после успешных проверок.

## Task 2: Общий расчёт прогресса и серий

**Files:**

- Create: `src/features/StudyGoals/helpers.ts`, `useStudyGoals.ts`.
- Modify: `src/NavigationPages/TrackTimePage/timerState.ts`, `src/NavigationPages/StatisticsPage/helpers.ts`, `useStatisticsPage.tsx`.
- Test: `scripts/study-goals.test.js`, `scripts/study-streak.test.js`, `scripts/focus-side-panel.test.js`.

**Interfaces:**

- `GoalProgress`: `goalId`, `completedSeconds`, `targetSeconds`, `remainingSeconds`, `percent`, `isComplete`.
- `getStudyGoalProgress(sessions: TimePeriod[], configuration: StudyGoalsConfiguration, now: number): GoalProgress[]`.
- `useStudyGoals()` возвращает configuration, progress, streak и weeklyPlan из общих функций; текущий timestamp обновляется при следующей локальной полуночи и возврате фокуса, без polling закрытого popup.

- [x] Написать failing tests: пустая история; 30 минут из 60 → 50%; превышение target → percent 100 и remaining 0; positive completed sessions считаются, future/invalid/negative durations игнорируются.
- [x] Добавить тесты завершения после полуночи, понедельника, DST в `Europe/Chisinau`, локальной группировки в другом timezone и обновления открытого экрана после полуночи.
- [x] Реализовать расчёт в секундах с локальными полуоткрытыми календарными интервалами; в интерфейсе показывать минуты. Не прибавлять активный timer и не сохранять проценты в Redux.
- [x] Для activity goals учитывать все явно привязанные aliases; disabled goals исключать из progress и planning.
- [x] Переиспользовать `getStudyStreak`, сохранив existing tests; добавить нулевые, некорректные и будущие сессии, отсутствие зависимости серии от target.
- [x] Заменить старый helper расчёта дневной цели общим расчётом, обновив side-panel test, который сегодня ожидает учёт текущего таймера.
- [x] Запустить `node --test scripts/study-goals.test.js`, `yarn test:study-streak`, `yarn test:side-panel`; commit `feat: #58 derive shared goal progress`.

## Task 3: Детерминированный недельный план

**Files:**

- Create: `src/features/StudyGoals/planning.ts`.
- Test: `scripts/study-goals.test.js`.

**Interfaces:**

- `WeeklyPlanDay`: `dateKey`, `totalSeconds`, `activitySeconds: { goalId: string; seconds: number }[]`, `generalSeconds`.
- `WeeklyStudyPlan`: `days: WeeklyPlanDay[]`, `unscheduledSeconds`, `unscheduledByGoal: { goalId: string; seconds: number }[]`.
- `getWeeklyStudyPlan(sessions: TimePeriod[], configuration: StudyGoalsConfiguration, now: number): WeeklyStudyPlan`.

- [x] Добавить failing tests: уже выполненная неделя → пустая нагрузка; нет учебных дней → весь остаток unscheduled; дневной лимит 60 минут не превышается; одинаковый input даёт одинаковый output.
- [x] Зафиксировать пример пересечения: remaining total 120 минут и activity 60 минут → всего 120, а не 180. Если activity demands суммарно 180 при total remaining 120 → требуется 180, без двойного счёта.
- [x] Реализовать remaining demand как `max(total remaining, sum(activity remaining))`; activity sessions одновременно закрывают total goal. Дневной target служит подсказкой и не превращается в дополнительное недельное обязательство.
- [x] Доступная нагрузка сегодня = `max(0, maxDailySeconds - completedTodaySeconds)`; прошедшие дни исключаются, остальные имеют full daily capacity. Перевыполнение не создаёт отрицательные значения.
- [x] Использовать среднюю положительную нагрузку за последние 14 локальных дней как soft recommendation; fallback — enabled daily target или 60 минут. Сначала распределить равномерно до soft limit, затем при необходимости до hard limit.
- [x] Выделить activity goals по stable goalId order, затем general time; каждый день суммарно не превышает capacity. Остаток показывать честно, не увеличивать лимит автоматически.
- [x] Проверить Sunday, все дни отключены, completedToday больше лимита, конфликт целей, маленькую историю, дробные session seconds и отсутствие мутации входных данных.
- [x] Запустить `node --test scripts/study-goals.test.js`; commit `feat: #58 calculate bounded weekly study plan`.

## Task 4: Управление целями и отображение на экранах

**Files:**

- Create: `src/features/StudyGoals/index.tsx`, `GoalSettings.tsx`, `GoalProgress.tsx`, `WeeklyPlan.tsx`.
- Modify: `src/screens/Settings/options.tsx`, `src/features/DailyGoalSetting/index.tsx` (заменить новым settings flow; удалить при отсутствии потребителей).
- Modify: `src/NavigationPages/TrackTimePage/index.tsx`, `src/screens/SidePanel/sidePanel.tsx`.
- Modify: `src/NavigationPages/StatisticsPage/index.tsx`, `src/NavigationPages/HistoryPage/index.tsx`.
- Modify: `src/locales/en.json`, `src/locales/ua.json`.
- Test: `scripts/study-goals-ui.test.js`.

- [x] Зафиксировать и проверить failing UI cases: создание/редактирование/disable/delete; невалидное поле не сохраняется; rename сохраняет старый alias; long names и отсутствие истории не скрывают controls.
- [x] Settings: компактные формы дневной и недельной цели, список activity goals, дни занятий и max daily workload. Существующие Button, ProgressBar, input patterns и Tailwind tokens.
- [x] Tracker и Side Panel: дневной progress рядом с timer context и компактная недельная строка; управление открывает Settings. Не перегружать главный экран полным планом.
- [x] Statistics: общий блок weekly progress, current/best streak, next milestone и раскрываемый план. Использовать существующий StudyStreak, без второго независимого расчёта.
- [x] History: тот же shared summary с явной подписью текущей недели; фильтр старой даты не меняет эту подпись или период goals.
- [x] Все цели отключены/удалены: краткое предложение создать цель; история и timer работают. Ошибки валидации локализованы; semantically labelled controls, keyboard focus, progressbar aria values.
- [x] Проверить формы и rendering tests, EN/UA, оба themes, popup 400px и Side Panel 320px; commit `feat: #58 add study goal controls and progress`.

## Task 5: Завершение target и milestones

**Files:**

- Create: `src/features/StudyGoals/milestones.ts`.
- Modify: `src/features/SessionSummary/index.tsx`, `useSessionSummary.ts`, `src/locales/en.json`, `src/locales/ua.json`.
- Test: `scripts/study-goals.test.js`, `scripts/session-summary.test.js`.

**Interfaces:**

- `getCompletedGoalIds(before: GoalProgress[], after: GoalProgress[]): string[]` возвращает только переходы false → true существующих целей.
- `getNextStreakMilestone(currentStreak: number): number | null` для предложенных 7/14/30; после 30 дополнительных отметок не придумывать.

- [x] Добавить failing tests: сессия закрывает daily/weekly/activity target; уже выполненная цель не создаёт повторное событие; cancel и reload не показывают новую celebration.
- [x] В finish flow сравнивать историю до/после именно завершённой сессии. Не трактовать import, изменение target или storage sync как новое достижение.
- [x] Добавить ненавязчивую локализованную строку в SessionSummary, обычный completed state на других экранах и следующую streak milestone; не трогать существующие 1000/10000-hour achievements.
- [x] Запустить goal и session-summary tests; commit `feat: #58 acknowledge completed study targets`.

## Task 6: Итоговая проверка и документация

- [x] Пройти полный сценарий: создать goals → start/pause/resume → finish → progress и plan обновились в popup и Side Panel → reload → значения сохранились.
- [x] Отдельно проверить cancel, rename, disable/delete, empty history, import/merge/replace, reset statistics, rollover недели и недостижимые goals.
- [x] Выполнить один batched browser QA round для EN/UA, light/dark, popup/Side Panel/Settings/Statistics/History. Исправить найденное одним пакетом и подтвердить максимум одним дополнительным раундом.
- [x] Запустить Impeccable detector один раз по изменённым UI targets; критические замечания проверить против существующих стилей.
- [x] Запустить все `test:*` scripts, включая новый `test:study-goals`, затем `yarn prettier:check`, `yarn lint`, `yarn build:release`, `yarn postbuild`, `git diff --check`.
- [x] Проверить реальное расширение Chrome с открытыми popup, options и Side Panel. Проверки с mocked Chrome APIs отдельно обозначить как mock verification.
- [x] Обновить `PRODUCT.md` и краткую пользовательскую документацию: completed-only progress, календарная неделя, rename aliases, ограничения плана и истории.
- [x] Обновить этот checklist фактическими результатами и оставшимися непроверенными сценариями. Generated `dist` и `build.zip` не коммитить.

## Статус и продолжение

- [x] Прочитаны issue #58, локальные AGENTS.md, текущая реализация целей, серий, persistence и тестов.
- [x] Подготовлен план полного scope с предложениями для отсутствующих продуктовых решений.
- [x] Согласованы предложения: начало недели, finished-only progress, правила alias rename, default лимита, milestones.
- [x] Выбран метод исполнения; рекомендуемый — последовательно в текущем чате, поскольку tasks тесно связаны общими types и persistence.
- [x] Реализация и проверки выполнены.

Реализация выполнена по последующему запросу пользователя. При продолжении перечитать фактические результаты ниже и проверить `git status --short --branch`. Команды продолжения предназначены для проверки или последующего изменения, а не повторной реализации.

## Фактические результаты реализации — 2026-09-29

- Конфигурация, миграция, progress, план, формы, milestones и completion messages реализованы. Goal tests объединены в `scripts/study-goals.test.js`; rendering regressions — `scripts/study-goals-ui.test.js`; реальные stores/backup — `scripts/store-persistence.test.js`.
- `node --test scripts/*.test.js`: 63/63 passed. `yarn tsc --noEmit`, `yarn lint`, `yarn prettier:check`, `yarn build:release`, `yarn postbuild`, `git diff --check` проходят. У lint остались предупреждения существующего кода; у Webpack — предупреждения размера bundle.
- В отдельном headless-профиле настоящего Chrome загружен production `dist` через CDP `Extensions.loadUnpacked`. Без mocked Chrome APIs проверены создание/валидация/disable/enable целей, start/pause/resume, завершение реальной минутной сессии, достижение трёх целей, синхронизация popup/Side Panel, cancel, rename aliases, reload, Statistics/History, удаление всех целей и сохранение удаления, reset statistics без удаления конфигурации.
- Переход открытой Side Panel через полночь проверен с Playwright clock: дневной progress обновился без завершения сессии или reload. Timezone/DST и лимиты покрыты Node tests; native Chrome выполнил проверку коротких activity allocations с точным выводом секунд.
- Независимое code review: исправлены округление отображаемого плана и malformed JSON kind; оба regression tests были RED до исправления и GREEN после. Visual review: исправлены смена языка сообщения о сохранении и контраст Manage link. Документальная проверка подтвердила согласованность PRODUCT.md и docs/study-goals.md.
- Финальное visual review: оба material fixes получили resolved, disposition ship; повторный широкий аудит не выполнялся.
- Финальная native проверка: сообщения сохранения цели и лимитов переключаются EN/UA; измеренный контраст Manage link — 6.97:1 в light и 8.09:1 в dark. Popup 400px и Side Panel 320px не имеют горизонтального overflow.
- Новые Tailwind tokens `goal.light`/`goal.dark` используются только для читаемого foreground Manage link; существующие orange/purple tokens не изменены. Система интерфейса сохранена.
- Решения исполнения: работа в уже выбранной ветке #58; общий test harness вместо трёх дублирующих файлов; один итоговый атомарный commit вместо промежуточных commits, чтобы commit содержал согласованные persisted schema и все потребители. Учитываются только валидные завершённые сессии; старые streak fixtures перенесены с полуночи на конец дня, чтобы сессии в fixtures не были будущими.
- `unscheduledSeconds` не содержит двойного счёта; `unscheduledByGoal` отражает остатки по каждой цели, которые могут пересекаться для total/activity. Нельзя складывать эти per-goal значения как общий остаток.
- Границы проверки: файловые dialogs import/export и пользовательский установленный профиль Chrome не изменялись; import/merge/replace проверены на уровне реальных Redux stores и data-transfer функций. Side Panel UI открыт по extension URL; вызов открытия через Chrome toolbar не менялся и отдельно не проверялся.

Повторная проверка: `yarn test:study-goals`, `yarn test:store`, `yarn test:study-streak`, `yarn test:side-panel`, `yarn lint`, `yarn prettier:check`, `yarn build:release`. Прежде чем править код, сверить текущий branch/diff и сохранить уже проверенное поведение.

QA artifacts: `/Users/admin/.codex/visualizations/2026/09/29/01a0eece-ba06-7ae1-a3f8-25ae6cb0e059/study-goals/` — screenshots, logs, verification.json.
