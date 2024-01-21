// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertTimestampsToDate = (item: any) => {
    if (item.start && item.start.seconds !== undefined) {
        item.start = new Date(item.start.seconds * 1000 + (item.start.nanoseconds || 0) / 1e6);
      }
    
      if (item.end && item.end.seconds !== undefined) {
        item.end = new Date(item.end.seconds * 1000 + (item.end.nanoseconds || 0) / 1e6);
      }
    
      return item;
};