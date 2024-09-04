import { SearchableMapping } from '../../types/types';
import PostSearchResult from '../SearchResult/Post/PostSearchResult';
import SearchView from '../SearchView/SearchView';

export default function Search() {
  const initialSearchCategory = 'all';
  const inputSearchLabel = 'Search';
  const inputSearchPlaceholder = 'Search for';
  const inputSearchNoResults = 'No results found';
  const maxAmountOfCards = 10;
  const searchableMapping: Record<string, SearchableMapping> = {
    post: {
      searchableFields: ['title'],
      idField: '_id',
      component: PostSearchResult,
      dataSet: [
        {
          _id: 'post1',
          _type: 'post',
          title: 'Exploring the Wonders of the Universe',
          slug: {
            _type: 'slug',
            current: 'exploring-the-wonders-of-the-universe',
          },
          author: { _ref: 'author1', _type: 'reference' },
          publishedAt: '2024-09-01T12:00:00Z',
        },
        {
          _id: 'post2',
          _type: 'post',
          title: 'The Beauty of Nature',
          slug: { _type: 'slug', current: 'the-beauty-of-nature' },
          author: { _ref: 'author2', _type: 'reference' },
          publishedAt: '2024-08-28T09:30:00Z',
        },
        {
          _id: 'post3',
          _type: 'post',
          title: 'A Journey Through Time',
          slug: { _type: 'slug', current: 'a-journey-through-time' },
          author: { _ref: 'author3', _type: 'reference' },
          publishedAt: '2024-07-15T15:00:00Z',
        },
        {
          _id: 'post4',
          _type: 'post',
          title: 'The Future of Space Exploration',
          slug: { _type: 'slug', current: 'the-future-of-space-exploration' },
          author: { _ref: 'author4', _type: 'reference' },
          publishedAt: '2024-06-20T08:00:00Z',
        },
        {
          _id: 'post5',
          _type: 'post',
          title: 'Discovering Ancient Civilizations',
          slug: { _type: 'slug', current: 'discovering-ancient-civilizations' },
          author: { _ref: 'author5', _type: 'reference' },
          publishedAt: '2024-05-10T12:30:00Z',
        },
      ],
    },
    page: {
      searchableFields: ['title'],
      idField: '_id',
      component: PostSearchResult,
      dataSet: [
        {
          _id: 'page1',
          _type: 'page',
          title: 'About Us',
          slug: { _type: 'slug', current: 'about-us' },
        },
        {
          _id: 'page2',
          _type: 'page',
          title: 'Contact Us',
          slug: { _type: 'slug', current: 'contact-us' },
        },
        {
          _id: 'page3',
          _type: 'page',
          title: 'Privacy Policy',
          slug: { _type: 'slug', current: 'privacy-policy' },
        },
        {
          _id: 'page4',
          _type: 'page',
          title: 'Terms of Service',
          slug: { _type: 'slug', current: 'terms-of-service' },
        },
      ],
    },
  };

  // add 100 000 more posts 
  for (let i = 6; i < 100006; i++) {
    searchableMapping.post.dataSet.push({
      _id: 'post' + i,
      _type: 'post',
      title: 'Post ' + i,
      slug: { _type: 'slug', current: 'post-' + i },
    });
  }
  
  return (
    <SearchView
      initialSearchCategory={initialSearchCategory}
      inputSearchLabel={inputSearchLabel}
      inputSearchPlaceholder={inputSearchPlaceholder}
      inputSearchNoResults={inputSearchNoResults}
      maxAmountOfCards={maxAmountOfCards}
      searchableMapping={searchableMapping}
    />
  );
}
