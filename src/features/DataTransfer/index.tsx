import React from 'react'
import { Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import { cn } from '../../utils'
import { TypeButton, TypeTittle } from '../../types'
import Title from '../../components/Title'
import DatePicker from '../../components/DatePicker'
import Button from '../../components/Button'

import { useDataTransfer } from './useDataTransfer'
import { DataTransferProps, StatusMessage } from './types'

function formatDate(timestamp?: number): string {
  if (!timestamp) return '-'

  return new Date(timestamp).toLocaleDateString()
}

const StatusAlert = ({
  statusMessage,
}: {
  statusMessage: StatusMessage
}): JSX.Element | null => {
  if (!statusMessage) return null

  const isSuccess = statusMessage.type === 'success'

  return (
    <div
      className={cn(
        'mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold',
        isSuccess
          ? 'border-secondary-light bg-secondary-light/10 text-secondary-light dark:border-purple-light dark:bg-purple-light/10 dark:text-purple-light'
          : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400',
      )}
    >
      {isSuccess ? (
        <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
      ) : (
        <ErrorOutlineIcon sx={{ fontSize: 18 }} />
      )}
      <span>{statusMessage.text}</span>
    </div>
  )
}

const DataTransfer = ({ interfaceLang }: DataTransferProps): JSX.Element => {
  const { dataTransfer } = interfaceLang.settings
  const {
    clearDateRange,
    closeExportModal,
    dateRange,
    exportMode,
    handleExportData,
    handleCancelImport,
    handleConfirmImport,
    handleDateRangeChange,
    handleExportModeChange,
    handleImportClick,
    handleImportData,
    importMode,
    importPreview,
    inputRef,
    isExportModalOpen,
    openExportModal,
    setImportMode,
    statusMessage,
  } = useDataTransfer()

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Title title={dataTransfer.title} variant={TypeTittle.SMALL} />
          <Tooltip title={dataTransfer.description}>
            <HelpOutlineIcon
              fontSize="medium"
              className="theme-text hover:text-secondary-light dark:hover:text-purple-dark cursor-pointer"
            />
          </Tooltip>
        </div>

        <div className="flex gap-3">
          <Button classes="w-24" onClick={openExportModal}>
            {dataTransfer.export}
          </Button>
          <Button
            classes="w-24"
            variant={TypeButton.SECONDARY}
            onClick={handleImportClick}
          >
            {dataTransfer.import}
          </Button>
        </div>
      </div>

      {!isExportModalOpen && <StatusAlert statusMessage={statusMessage} />}

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-[460px] rounded-lg border border-secondary-light bg-white p-4 shadow-xl dark:border-purple-light dark:bg-black">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="theme-text text-lg font-bold">
                  {dataTransfer.exportModalTitle}
                </p>
                <p className="mt-1 text-[13px] text-gray-600 dark:text-gray-300">
                  {dataTransfer.exportModalDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={closeExportModal}
                className="theme-text px-2 text-2xl leading-none hover:text-secondary-light dark:hover:text-purple-light"
              >
                x
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleExportModeChange('all')}
                className={cn(
                  'rounded-lg border px-3 py-2 text-[13px] font-bold transition-colors',
                  exportMode === 'all'
                    ? 'border-secondary-light bg-secondary-light text-white dark:border-purple-dark dark:bg-purple-dark'
                    : 'theme-text border-gray-300 dark:border-purple-light',
                )}
              >
                {dataTransfer.exportAllTime}
              </button>
              <button
                type="button"
                onClick={() => handleExportModeChange('range')}
                className={cn(
                  'rounded-lg border px-3 py-2 text-[13px] font-bold transition-colors',
                  exportMode === 'range'
                    ? 'border-secondary-light bg-secondary-light text-white dark:border-purple-dark dark:bg-purple-dark'
                    : 'theme-text border-gray-300 dark:border-purple-light',
                )}
              >
                {dataTransfer.exportDateRange}
              </button>
            </div>

            <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-300">
              {exportMode === 'all'
                ? dataTransfer.exportAllHint
                : dataTransfer.exportRangeHint}
            </p>

            {exportMode === 'range' && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="theme-text text-[12px] font-semibold">
                  {dataTransfer.dateFrom}
                  <DatePicker
                    value={dateRange.from}
                    max={dateRange.to || undefined}
                    placeholder={dataTransfer.selectDate}
                    onChange={event => handleDateRangeChange('from', event)}
                  />
                </label>
                <label className="theme-text text-[12px] font-semibold">
                  {dataTransfer.dateTo}
                  <DatePicker
                    value={dateRange.to}
                    min={dateRange.from || undefined}
                    placeholder={dataTransfer.selectDate}
                    onChange={event => handleDateRangeChange('to', event)}
                  />
                </label>
              </div>
            )}

            <StatusAlert statusMessage={statusMessage} />

            <div className="mt-4 flex justify-between gap-2">
              {exportMode === 'range' ? (
                <Button
                  classes="px-3 py-1.5 text-[12px]"
                  variant={TypeButton.LINK}
                  onClick={clearDateRange}
                >
                  {dataTransfer.clearRange}
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button
                  classes="px-3 py-1.5 text-[12px]"
                  variant={TypeButton.SECONDARY}
                  onClick={closeExportModal}
                >
                  {dataTransfer.cancelImport}
                </Button>
                <Button
                  classes="px-3 py-1.5 text-[12px]"
                  onClick={() =>
                    handleExportData(
                      dataTransfer.exportSuccess,
                      dataTransfer.dateRangeError,
                    )
                  }
                >
                  {dataTransfer.downloadJson}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {importPreview && (
        <div className="theme-text mt-3 rounded-lg border border-gray-300 p-3 text-[13px] dark:border-purple-light">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold">{dataTransfer.previewTitle}</p>
              <p className="text-[12px] text-gray-600 dark:text-gray-300">
                {dataTransfer.previewDescription}
              </p>
            </div>
            <span className="rounded-lg bg-secondary-light px-2 py-1 text-[11px] font-bold text-white dark:bg-purple-dark">
              {importMode === 'merge'
                ? dataTransfer.mergeMode
                : dataTransfer.replaceMode}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-gray-100 p-2 text-center dark:bg-[#212830]">
              <p className="text-lg font-bold">
                {importPreview.summary.timerSessionsCount}
              </p>
              <p className="text-[11px]">{dataTransfer.previewTimerSessions}</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-2 text-center dark:bg-[#212830]">
              <p className="text-lg font-bold">
                {importPreview.summary.domainSessionsCount}
              </p>
              <p className="text-[11px]">
                {dataTransfer.previewDomainSessions}
              </p>
            </div>
            <div className="rounded-lg bg-gray-100 p-2 text-center dark:bg-[#212830]">
              <p className="text-lg font-bold">
                {importPreview.summary.blackListCount}
              </p>
              <p className="text-[11px]">{dataTransfer.previewBlackList}</p>
            </div>
          </div>

          <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-300">
            {dataTransfer.previewPeriod}:{' '}
            {formatDate(importPreview.summary.firstSessionDate)} -{' '}
            {formatDate(importPreview.summary.lastSessionDate)}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setImportMode('merge')}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[12px] font-bold transition-colors',
                importMode === 'merge'
                  ? 'border-secondary-light bg-secondary-light text-white dark:border-purple-dark dark:bg-purple-dark'
                  : 'theme-text border-gray-300 dark:border-purple-light',
              )}
            >
              {dataTransfer.mergeMode}
            </button>
            <button
              type="button"
              onClick={() => setImportMode('replace')}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-[12px] font-bold transition-colors',
                importMode === 'replace'
                  ? 'border-secondary-light bg-secondary-light text-white dark:border-purple-dark dark:bg-purple-dark'
                  : 'theme-text border-gray-300 dark:border-purple-light',
              )}
            >
              {dataTransfer.replaceMode}
            </button>
          </div>

          <p className="mt-2 text-[12px] text-gray-600 dark:text-gray-300">
            {importMode === 'merge'
              ? dataTransfer.mergeDescription
              : dataTransfer.replaceDescription}
          </p>

          <div className="mt-3 flex justify-end gap-2">
            <Button
              classes="px-3 py-1.5 text-[12px]"
              variant={TypeButton.SECONDARY}
              onClick={handleCancelImport}
            >
              {dataTransfer.cancelImport}
            </Button>
            <Button
              classes="px-3 py-1.5 text-[12px]"
              variant={
                importMode === 'replace'
                  ? TypeButton.ERROR_TWO
                  : TypeButton.PRIMARY
              }
              onClick={() => handleConfirmImport(dataTransfer.importSuccess)}
            >
              {importMode === 'merge'
                ? dataTransfer.confirmMergeImport
                : dataTransfer.confirmReplaceImport}
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={event => handleImportData(event, dataTransfer.importError)}
      />
    </div>
  )
}

export default DataTransfer
