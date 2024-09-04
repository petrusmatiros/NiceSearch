export interface SearchableMapping {
  searchableFields: string[];
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}