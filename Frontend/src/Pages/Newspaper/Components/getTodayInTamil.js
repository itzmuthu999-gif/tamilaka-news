export function getTodayInTamil() {
  const today = new Date();

  const tamilDays = [
    "ஞாயிறு",      // Sunday
    "திங்கள்",     // Monday
    "செவ்வாய்",    // Tuesday
    "புதன்",       // Wednesday
    "வியாழன்",     // Thursday
    "வெள்ளி",      // Friday
    "சனி"          // Saturday
  ];

  const tamilMonths = [
    "ஜனவரி",       // January
    "பிப்ரவரி",     // February
    "மார்ச்",       // March
    "ஏப்ரல்",       // April
    "மே",           // May
    "ஜூன்",         // June
    "ஜூலை",        // July
    "ஆகஸ்ட்",       // August
    "செப்டம்பர்",    // September
    "அக்டோபர்",     // October
    "நவம்பர்",      // November
    "டிசம்பர்"      // December
  ];

  const dayName = tamilDays[today.getDay()];
  const monthName = tamilMonths[today.getMonth()];
  const date = today.getDate();
  const year = today.getFullYear();

  return `${dayName} ${monthName} ${date} ${year}`;
}

// Example usage:

