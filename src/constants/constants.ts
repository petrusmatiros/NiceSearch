import { TimeInType } from "../types/types";


export const TimeIn: TimeInType = {
  Milliseconds: {
    divideBy: 1,
    postfix: 'ms',
  },
  Seconds: {
    divideBy: 1000,
    postfix: 's',
  },
};
