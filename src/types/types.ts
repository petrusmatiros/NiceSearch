export interface SearchableMapping {
  searchableField: string;
  component: (props: any) => JSX.Element;
  idField: string;
  dataSet: any[];
}