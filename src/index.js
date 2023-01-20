import { fetchPhotos } from './fetchPhotos';

import axios from 'axios';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

let page = 1;
let searchQuery;

formEl.addEventListener('submit', onSearch);
btnLoadMore.addEventListener('click', onLoadMore);
galleryEl.addEventListener('click', onGalleryClick);

function onSearch(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';

  searchQuery = formEl.children[0].value.trim();

  if (searchQuery.length === 0) {
    return Notiflix.Notify.failure('Please, enter a query.');
  }

  fetchPhotos(searchQuery, page)
    .then(data => {
      console.log(data);
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        galleryMarkup(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        btnLoadMore.hidden = false;
      }
    })
    .catch(err => console.log(err));
}

function galleryMarkup(arr) {
  const markup = arr
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
            </p>
  </div>
</div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function onGalleryClick(evt) {
  evt.preventDefault();
  const gallery = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}

function onLoadMore() {
  page += 1;

  fetchPhotos(searchQuery, page).then(data => {
    galleryMarkup(data.hits);

    if ((page - 1) * 40 + data.hits.length >= data.total) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      btnLoadMore.hidden = true;
    }
  });
}
