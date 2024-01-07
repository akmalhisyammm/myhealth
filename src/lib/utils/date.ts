import dayjs from 'dayjs';

/**
 * Converts a date to a NAT64 number.
 * @param date The date to be converted.
 * @returns the NAT64 number.
 */
export const dateToNat64 = (date: Date): bigint =>
  BigInt(dayjs(date).valueOf()) * BigInt(1_000_000);

/**
 * Converts a NAT64 number to a date.
 * @param nat64 The NAT64 number to be converted.
 * @returns the date.
 */
export const nat64ToDate = (nat64: bigint): Date => dayjs(Number(nat64 / 1_000_000n)).toDate();

/**
 * Converts a date to an age.
 * @param date The date to be converted.
 * @returns the age.
 */
export const dateToAge = (date: Date): number => dayjs().diff(date, 'year');
