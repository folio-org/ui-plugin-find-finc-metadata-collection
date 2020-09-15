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
  metadataAvailableFilter = scoped('section[id="filter-accordion-metadataAvailable"]');
  usageRestrictedFilter = scoped('section[id="filter-accordion-usageRestricted"]');
  freeContentFilter = scoped('section[id="filter-accordion-freeContent"]');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
  });

  searchField = scoped('#collectionSearchField', SearchField);
  searchFocused = is('#collectionSearchField', ':focus');
  searchButton = scoped('#collectionSubmitSearch', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  submitBtn = scoped('#collectionSubmitSearch');
  resetAllBtn = scoped('#clickable-reset-all');
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
