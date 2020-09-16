import {
  blurrable,
  clickable,
  collection,
  focusable,
  fillable,
  interactor,
  is,
  isPresent,
  scoped,
  text,
} from '@bigtest/interactor';

@interactor class SearchField {
  static defaultScope = '#collectionSearchField';
  isFocused = is(':focus');
  focus = focusable();
  fill = fillable();
  blur = blurrable();
  value = text();
}

@interactor class PluginModalInteractor {
  static defaultScope = '#ModuleContainer';
  mdSourceFilter = scoped('section[id="filter-accordion-mdSource"]');
  freeContentFilter = scoped('section[id="filter-accordion-freeContent"]');
  permittedFilter = scoped('section[id="filter-accordion-permitted"]');
  selectedFilter = scoped('section[id="filter-accordion-selected"]');
  assignedFilter = scoped('section[id="filter-accordion-assigned"]');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
    check: clickable('input[type=checkbox]'),
  });

  searchField = scoped('#collectionSearchField', SearchField);
  searchFocused = is('#collectionSearchField', ':focus');
  searchButton = scoped('#collectionSubmitSearch', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  submitBtn = scoped('#collectionSubmitSearch');
  resetAllBtn = scoped('#clickable-reset-all');

  saveButton = scoped('[data-test-find-records-modal-save]', {
    click: clickable()
  });

  noResultsDisplayed = isPresent('[data-test-find-collection-no-results-message]');
}

@interactor class FindCollectionInteractor {
  button = scoped('#clickable-plugin-find-finc-metadata-collection', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor();
}

export default FindCollectionInteractor;
