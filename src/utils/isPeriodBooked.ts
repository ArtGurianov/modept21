export const isPeriodBooked = (offeredPeriodFrom: Date, offeredPeriodTill: Date, existingPeriodFrom: Date, existingPeriodTill: Date): boolean => {
  if (
    offeredPeriodTill.getTime() <= existingPeriodFrom.getTime()
    ||
    existingPeriodTill.getTime() <= offeredPeriodFrom.getTime()
  ) {
    return false;
  }
  return true;
};