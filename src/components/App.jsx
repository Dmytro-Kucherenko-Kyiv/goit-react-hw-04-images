import { Layout } from './Layout/Layout';
import { GlobalStyle } from './GlobalStyle';
import { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import * as API from 'services/api';
import ContentLoader from 'react-content-loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { LoadMoreBtn } from './Button/Button';

export const App = () => {
  const [gallery, setGallery] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchValue === '') return;
    const controller = new AbortController();
    async function gettingPage() {
      try {
        setIsLoading(true);
        const fetchImages = await API.getImages(searchValue, page, {
          signal: controller.signal,
        });
        setGallery(prevState => [...prevState, ...fetchImages.hits]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    gettingPage();
    return () => {
      controller.abort();
    };
  }, [page, searchValue]);

  const onSubmit = value => {
    try {
      if (value === searchValue) {
        return;
      }
      setSearchValue(value);
      setGallery([]);
      setPage(1);
    } catch (err) {
      alert(err.message);
    }
  };
  const LoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  return (
    <Layout>
      <Searchbar onSubmit={onSubmit} />
      {isLoading && (
        <ContentLoader
          viewBox="0 0 400 160"
          height={60}
          width={100}
          backgroundColor="maroon"
          foregroundColor="orange"
          style={{ width: '100%', marginTop: '0' }}
          interval={0.1}
        >
          <circle cx="100" cy="20" r="20" />
          <circle cx="194" cy="20" r="20" />
          <circle cx="288" cy="20" r="20" />
        </ContentLoader>
      )}
      <ImageGallery values={gallery} />
      {gallery.length !== 0 && <LoadMoreBtn onClick={LoadMore} />}
      <GlobalStyle />
    </Layout>
  );
};