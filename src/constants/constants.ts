import { TimeFormatType } from '../types/types';

export const TimeFormat: TimeFormatType = {
  Milliseconds: {
    divideBy: 1,
    postfix: 'ms',
  },
  Seconds: {
    divideBy: 1000,
    postfix: 's',
  },
};
