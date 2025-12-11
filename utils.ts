export const calculateDuration = (start: string, end: string): number => {
  // Simple parser for HH:mm formats
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  let duration = (endH + endM / 60) - (startH + startM / 60);
  
  // Handle overnight shifts (e.g., 18:00 to 07:00)
  if (duration < 0) {
    duration += 24;
  }
  
  return parseFloat(duration.toFixed(2));
};

export const formatDate = (dateString: string): string => {
  return dateString; // Keeping original format for display simplicity
};