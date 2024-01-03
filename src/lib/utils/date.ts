import dayjs from 'dayjs';

/**
 * Converts a date to a NAT64 number.
 * @param date The date to be converted.
 * @returns the NAT64 number.
 */
export const dateToNat64 = (date: Date): bigint =>
  BigInt(dayjs(date).valueOf()) * BigInt(1_000_000);

/**
 * Converts a date to an age.
 * @param date The date to be converted.
 * @returns the age.
 */
export const dateToAge = (date: Date): number => dayjs().diff(date, 'year');
