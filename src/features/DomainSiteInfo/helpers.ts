function formatDomainName(name: string): string {
  if (name.includes('-')) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  if (/[A-Z]/.test(name.slice(1))) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return name.charAt(0).toUpperCase() + name.slice(1)
}

/* eslint-disable */
export const getReadableName = (url: string): string => {
  let domain = url?.replace(/^(https?:\/\/)/, '') || ''

  domain = domain.split('/')[0]
  const parts = domain.split('.')
  let mainDomain

  if (parts.length > 2 && parts[0] !== 'www') {
    mainDomain = parts[1]
  } else if (parts.length > 2 && parts[0] === 'www') {
    mainDomain = parts[1]
  } else {
    mainDomain = parts[0]
  }

  return formatDomainName(mainDomain)
}
