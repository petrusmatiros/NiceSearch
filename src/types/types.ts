export interface SearchableMapping {
  searchableFields: string[];
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}

export interface TimeFormatType {
  Milliseconds: {
    divideBy: number;
    suffix: string;
  };
  Seconds: {
    divideBy: number;
    suffix: string;
  };
}

export type TimeFormatKeyType = TimeFormatType[keyof TimeFormatType];
