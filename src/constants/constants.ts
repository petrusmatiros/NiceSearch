import { TimeFormatType } from '../types/types';

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
