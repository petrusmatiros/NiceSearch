import { TimeFormatType } from '../types/types';

const HASH = 'e0caca80';
export const UNIQUE_HASH = `#${HASH}=`;

export const TimeFormat: TimeFormatType = {
  Milliseconds: {
    divideBy: 1,
    suffix: 'ms',
  },
  Seconds: {
    divideBy: 1000,
    suffix: 's',
  },
};
