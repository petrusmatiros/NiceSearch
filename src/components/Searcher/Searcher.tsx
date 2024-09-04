import uFuzzy from '@leeoniya/ufuzzy';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '../../utils';

interface SearcherProps {
  searcherName: string;
  searcherFuzzyOptions?: uFuzzy.Options;
  searcherDataSet: any[];
  searcherSearchableFields: string[];
  searcherIdField: string;
  searchString: string;
  searchCategory: string;
  initialSearchCategory: string;
  amountOfResults?: number;
  allowSearchExecution: boolean;
  setSearchResults: Dispatch<SetStateAction<{ [key: string]: any[] }>>;
  onClick: (data: any) => void;
  className?: string;
}

export default function Searcher({
  searcherName,
  searcherFuzzyOptions,
  searcherDataSet,
  searcherSearchableFields,
  searcherIdField,
  searchString,
  searchCategory,
  initialSearchCategory,
  amountOfResults,
  allowSearchExecution,
  setSearchResults,
  onClick,
  className,
}: SearcherProps) {
  const [fuzzyRef, setFuzzyRef] = useState<uFuzzy | null>(null);
  const [mainDataIndex, setMainDataIndex] = useState<Map<string, any>>(
    new Map()
  );
  const [searchableDataSet, setSearchableDataSet] = useState<string[]>([]);
  const [searchIndex, setSearchIndex] = useState<Map<string, string>>(
    new Map()
  );

  useEffect(() => {
    function generateSearchableDataSet(
      data: any[],
      searchableFields: string[],
      idField: string
    ): string[] | string {
      if (!data.length) {
        return 'No data provided';
      }
      if (!searchableFields || !searchableFields.length) {
        return 'No searchable fields provided';
      }
      if (!idField) {
        return 'No ID field provided';
      }

      const searchIndex = new Map();
      const mainDataIndex = new Map();

      if (searchIndex.size || mainDataIndex.size) {
        return 'Indices are not empty';
      }

      /**
       * Generate string data set out of searchable fields
       * Iterate through data, for each item, look through each searchable field
       * For each searchable field, add the field data to the searchIndex and push the data to the data set
       * After all of the searchable fields have been parsed for that given item, push the data to the dataset, and continue
       */
      const dataSet: string[] = [];
      for (let i = 0; i < data.length; ++i) {
        const item = data[i];
        const itemIdField = item[idField].toString();
        for (let k = 0; k < searchableFields.length; ++k) {
          const fieldToSearch = searchableFields[k];
          const itemSearchableField = item[fieldToSearch].toString();
  
          // Generate index (overriding duplicates)
          searchIndex.set(itemSearchableField, itemIdField);
          
          dataSet.push(itemSearchableField.toString());
        }

        // Passing reference to the main data
        mainDataIndex.set(itemIdField, item);
      }

      if (!dataSet.length) {
        return 'No dataset could be compiled';
      }

      // Set the indices
      setSearchIndex(searchIndex);
      setMainDataIndex(mainDataIndex);
      setFuzzyRef(new uFuzzy(searcherFuzzyOptions));

      return dataSet;
    }

    const dataSet = generateSearchableDataSet(
      searcherDataSet,
      searcherSearchableFields,
      searcherIdField
    );

    if (typeof dataSet === 'string') {
      console.error(dataSet);
    }

    setSearchableDataSet(dataSet as string[]);
  }, []);

  useEffect(() => {
    console.log("Execute search for", searcherName)
    if (!allowSearchExecution) {
      return;
    }
    if (searchString.trim().length === 0) {
      return;
    }
    if (searchCategory !== searcherName && searchCategory !== initialSearchCategory) {
      return;
    }
    setSearchResults((prev) => {
      return {
        ...prev,
        [searcherName]: executeSearch(
          fuzzyRef,
          mainDataIndex,
          searchableDataSet,
          searchIndex,
          searchString
        ),
      };
    });
  }, [searchString, searchCategory]);

  function executeSearch(
    fuzzy: uFuzzy | null,
    mainDataIndex: Map<string, any>,
    stringDataSet: string[],
    searchIndex: Map<string, string>,
    searchQuery: string
  ) {
    if (searchQuery.trim().length === 0) return [];
    if (!fuzzy) return [];

    const fuzzyResults = fuzzy.search(stringDataSet, searchQuery, 0);

    // Select first entry of results, since the first array contains the search results
    const resultIndices = fuzzyResults[0] ?? [];
    const searchResults: any[] = [];
    for (let i = 0; i < resultIndices.length; ++i) {
      const retrievedIndexID = searchIndex.get(stringDataSet[resultIndices[i]]);
      const objectData = retrievedIndexID
        ? mainDataIndex.get(retrievedIndexID)
        : null;
      if (objectData) {
        searchResults.push(objectData);
      }
    }
    return searchResults;
  }

  return (
    <div onClick={onClick} className={className}>
      <p>
        {capitalizeFirstLetter(searcherName)} {<span>({amountOfResults})</span>}
      </p>
    </div>
  );
}