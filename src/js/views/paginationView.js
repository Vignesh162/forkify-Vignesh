import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const data = this._data;
    const curPage = data.page;
    const numPages = Math.ceil(data.results.length / data.resultsPerPage);
    // 1st page and other Pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }"class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    }

    // 1st page and no other Pages
    else if (curPage === 1 && numPages <= 1) {
      return ``;
    }

    // last page
    else if (curPage === numPages && curPage > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }"class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
      </button>`;
    }
    // other pages
    else {
      return `
      <button data-goto="${curPage - 1}" 
      class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
      </button>
      <button data-goto="${
        curPage + 1
      }"class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>`;
    }
  }
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}
export default new PaginationView();
