export function safeID(name: string) {
  return name.replaceAll(/\s+/g, '-').replaceAll(/-+/g, '-')
}

export function betweenDays(startDate: Date, endDate: Date) {
    const oneDay = 1000 * 60 * 60 * 24;
  
    const start = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const end = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
    return (start - end) / oneDay;
}

export function oneMonthAgo() {
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = oneDay * 30;
  return (Date.now() - oneMonth);
}