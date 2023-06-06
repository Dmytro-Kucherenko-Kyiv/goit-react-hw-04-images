import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';

export const getImages = async (searchSubmit, page = 1, controller) => {
  const API_KEY = '36893572-b04f46b6e76820915a5295ba9';
  const response = await axios.get(
    `/?q=${searchSubmit}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`,
    controller
  );
  if (response.status === 404) {
    throw new Error('Error loading images from Pixabay', response.status);
  }
  return response.data;
};