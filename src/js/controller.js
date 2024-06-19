import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView .js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
//import 'regenerator-runtime/runtime';
//import { async } from 'regenerator-runtime';
///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0 Update Results View to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // 1 Loading recipe
    await model.loadRecipe(id);

    // 2 Rendering Recipe
    recipeView.render(model.state.recipe);

    // 3 updating Bookmarks
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = await searchView.getQuery();

    if (!query) return;

    // 2) Get search results
    await model.loadSearchResult(query);

    // 3) Render result
    resultsView.render(model.getSearchResultsPage());

    // 4) Render intial Pagination btns
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render New pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update Servings (in state)
  model.updateServing(newServings);

  // Update Recipe View
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe view
  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
////////////////////////////////////////////////////////////////////////

// Intialize
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
