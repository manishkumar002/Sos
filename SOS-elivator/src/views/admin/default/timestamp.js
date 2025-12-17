
export function convertToUserTime(utcDateTime) {

  const date = new Date(utcDateTime);

  const localTime = date.toLocaleString([], {
    hour12: false,       
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return localTime;
}



export function convertToUserTime12Hour(utcDateTime) {
  const date = new Date(utcDateTime);

  const localTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,  
  });

  return localTime; 
}
