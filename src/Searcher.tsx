import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import uFuzzy from '@leeoniya/ufuzzy';
import './App.css';
import { capitalizeFirstLetter } from './utils';

interface SearcherProps {
  searcherName: string;
  searcherFuzzyOptions?: uFuzzy.Options;
  searcherDataSet: any[];
  searcherSearchableField: string;
  searcherIdField: string;
  searchString: string;
  setSearchResults: Dispatch<SetStateAction<{ [key: string]: any[] }>>
  onClick: (data: any) => void;
  className?: string;
}

function Searcher({
  searcherName,
  searcherFuzzyOptions,
  searcherDataSet,
  searcherSearchableField,
  searcherIdField,
  searchString,
  setSearchResults,
  onClick,
  className,
}: SearcherProps) {
  const fuzzy = new uFuzzy(searcherFuzzyOptions ?? {});
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
      searchableField: string,
      idField: string
    ): string[] | string {
      if (!data.length) {
        return 'No data provided';
      }
      if (!searchableField) {
        return 'No searchable field provided';
      }
      if (!idField) {
        return 'No ID field provided';
      }

      const searchIndex = new Map();
      const mainDataIndex = new Map();

      if (searchIndex.size || mainDataIndex.size) {
        return 'Indices are not empty';
      }

      // Generate searchable string dataset
      const dataSet: string[] = [];
      for (let i = 0; i < data.length; ++i) {
        const item = data[i];
        const itemSearchableField = item[searchableField].toString();
        const itemIdField = item[idField].toString();

        // Generate index (overriding duplicates)
        searchIndex.set(itemSearchableField, itemIdField);
        // Passing reference to the main data
        mainDataIndex.set(itemIdField, item);

        dataSet.push(itemSearchableField.toString());
      }

      if (!dataSet.length) {
        return 'No dataset could be compiled';
      }

      // Set the indices
      setSearchIndex(searchIndex);
      setMainDataIndex(mainDataIndex);

      return dataSet;
    }

    const dataSet = generateSearchableDataSet(searcherDataSet, searcherSearchableField, searcherIdField);

    if (typeof dataSet === 'string') {
      console.error(dataSet);
    }

    setSearchableDataSet(dataSet as string[]);
  }, []);

  useEffect(() => {
    if (searchString.trim().length === 0) {
      return;
    }
    setSearchResults((prev) => {
      return {
        ...prev,
        [searcherName]: executeSearch(fuzzy, mainDataIndex, searchableDataSet, searchIndex, searchString),
      };
    });
  }, [searchString]);

  function executeSearch(
    fuzzy: uFuzzy,
    mainDataIndex: Map<string, any>,
    stringDataSet: string[],
    searchIndex: Map<string, string>,
    searchQuery: string
  ) {
    if (searchQuery.trim().length === 0) return [];
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
    console.log("Search results", searchResults, "with query", searchQuery);
    return searchResults;
  }

  return (
    <div onClick={onClick} className={className}>{capitalizeFirstLetter(searcherName)}</div>
  );
}

export default Searcher;
