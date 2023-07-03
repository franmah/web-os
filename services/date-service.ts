
/**
 * @returns date string with format m/d/yyyy h:mm AM/PM
 */
export const toDateModifedFormat = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ` +
    `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() > 12 ? 'PM' : 'AM'}`;
}