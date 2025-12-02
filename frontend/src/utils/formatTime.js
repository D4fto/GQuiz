export default function formatTime(value) {
    
    let digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");;

    
    if (digits.length > 3) digits = digits.slice(0, 3);

    if (digits.length <= 2) {
      
      digits = digits.padStart(2, "0");
      return `0:${digits}`;
    } 

    
    const minutes = digits.slice(0, -2);
    const seconds = digits.slice(-2);

    return `${minutes}:${seconds}`;
  };

export function extractSeconds(formatted){
  const [minutes, seconds] = formatted.split(':').map(Number);
  return minutes * 60 + seconds;
}