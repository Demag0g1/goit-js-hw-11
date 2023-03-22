import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  // btnLoadMore: document.querySelector('.load-more'),
};

let page = 1;
// refs.btnLoadMore.style.display = 'none';
refs.form.addEventListener('submit', onSearch);
// refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSearch(e) {
  e.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';

  const name = refs.input.value.trim();

  if (name !== '') {
    pixabay(name);
  } else {
    // refs.btnLoadMore.style.display = 'none';
    return Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
  }
}

function onBtnLoadMore() {
  const name = refs.input.value.trim();
  page++;
  pixabay(name, page);
}

async function pixabay(name, page) {
  const API_URL = 'https://pixabay.com/api/';

  const option = {
    params: {
      key: '34274637-90bf7bd4f5bdc6d5a10f5d2a3',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };

  try {
    const response = await axios.get(API_URL, option);
    notification(response.data.hits.length, response.data.total);
    createMarkup(response.data);
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  const markup = arr.hits
    .map(
      item =>
        `<a class="photo-link" href="${item.largeImageURL}">
            <div class="photo-card">
              <div class="photo">
                <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
                  </div>
                    <div class="info">
                  <p class="info-item">
                    <b>Likes</b>
                    ${item.likes}
                  </p>
                  <p class="info-item">
                    <b>Views</b>
                    ${item.views}
                  </p>
                  <p class="info-item">
                    <b>Comments</b>
                    ${item.comments}
                  </p>
                  <p class="info-item">
                    <b>Downloads</b>
                    ${item.downloads}
                  </p>
                  </div>
                 </div>        
            </div>
          </a>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  simpleLightbox.refresh();
}

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

function notification(length, totalHits) {
  if (length === 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }

  if (page === 1) {
    // refs.btnLoadMore.style.display = 'flex';
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (length < 40) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();

  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    page++;
    onBtnLoadMore();
  }
});
