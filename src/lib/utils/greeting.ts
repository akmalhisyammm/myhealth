/**
 * Generate greeting message based on the time.
 * @param {string} name - Name of the user
 * @returns {string} Greeting message
 */
export const greetingMessage = (name: string): string => {
  const hour = new Date().getHours();

  if (hour < 12) return `Selamat pagi, ${name} 🌅`;
  if (hour < 18) return `Selamat sore, ${name} 🌇`;
  return `Selamat malam, ${name} 🌃`;
};
