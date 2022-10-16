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

// A little bit simplified version
export const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);


export function getSetFirst(set) {
  return set.values().next().value;
}

export function chunkUsgsResponse(text) {
  let chunks = []
  let lines = []
  text.split("\n").map(l => {
    if(l.indexOf('#') != 0) {
      lines.push(l);
    } else {
      if(lines.length > 0) {
        chunks.push(lines.join("\n"));
      }
      lines = [];
    }
  });
  
  if(lines.length > 0) {
    chunks.push(lines.join("\n"));
  } 

  return chunks;
}

