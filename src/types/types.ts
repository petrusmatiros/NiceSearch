export interface SearchableMapping {
  searchableFields: string[];
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}

export interface TimeInType {
  Milliseconds: {
    divideBy: number;
    postfix: string;
  };
  Seconds: {
    divideBy: number;
    postfix: string;
  };
}

export type TimeInKeyType = TimeInType[keyof TimeInType]
