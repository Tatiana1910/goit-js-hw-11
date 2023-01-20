export { fetchPhotos };
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '32968388-b31919f1c04eebb6402c46dda';

// const options = {
//   image_type: 'photo',
//   orientation: 'horizontal',
//   safesearch: true,
//   per_page: 40,
// };

async function fetchPhotos(searchQuery, page = 1) {
  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${searchQuery}&image_type=photo&orientation =horizontal&safesearch =true&per_page=40&page=${page}`
  );
  return response.data;
}
// fetchPhotos()
//   .then(data => console.log(data))
//   .catch(err => console.log(err));
