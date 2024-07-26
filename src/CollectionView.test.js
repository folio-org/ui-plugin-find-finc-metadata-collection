import { noop } from 'lodash';
import { BrowserRouter as Router } from 'react-router-dom';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import CollectionsView from './CollectionsView';

jest.mock('./CollectionFilters', () => {
  return () => <span>CollectionFilters</span>;
});

const ARRAY_COLLECTION = [
  {
    id: 'ccdbb4c7-9d58-4b59-96ef-7074c34e901b',
    label: 'Test collection 1',
  },
  {
    id: 'aadbb4c7-9d58-4b59-96ef-7074c34e901a',
    label: 'Test collection 2',
  }
];

const onChangeIndex = jest.fn();
const onSubmit = jest.fn();

const renderCollectionsView = (
  metadataCollection = ARRAY_COLLECTION,
  queryGetter = noop,
  querySetter = noop
) => (
  renderWithIntl(
    <Router>
      <CollectionsView
        data={metadataCollection}
        queryGetter={queryGetter}
        querySetter={querySetter}
        onChangeIndex={onChangeIndex}
        onClose={jest.fn}
        onSubmit={onSubmit}
      />
    </Router>,
    translationsProperties
  )
);

describe('CollectionView', () => {
  beforeEach(() => {
    renderCollectionsView();
  });

  it('filter pane and searchField should be visible', () => {
    expect(document.querySelector('#plugin-find-collection-filter-pane')).toBeInTheDocument();
    expect(document.querySelector('#collectionSearchField')).toBeInTheDocument();
  });

  it('search field should be active element', () => {
    const focusedElem = document.activeElement;
    expect(focusedElem?.id).toBe('collectionSearchField');
  });

  it('buttons for submit and reset should be visible', () => {
    expect(document.querySelector('#collectionSubmitSearch')).toBeInTheDocument();
    expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    expect(document.querySelector('#collectionSubmitSearch')).toHaveAttribute('disabled');
  });

  test('enter search string should enable submit button', async () => {
    const searchButton = document.querySelector('#collectionSubmitSearch');

    expect(searchButton).toHaveAttribute('disabled');

    await userEvent.type(document.querySelector('#collectionSearchField'), 'collection');

    expect(searchButton).toBeEnabled();
  });

  test('if collapse filter pane is working', async () => {
    expect(document.querySelector('#paneHeaderplugin-find-collection-filter-pane-pane-title')).toBeInTheDocument();
    expect(document.querySelector('[data-test-collapse-filter-pane-button]')).toBeInTheDocument();

    await userEvent.click(document.querySelector('[data-test-collapse-filter-pane-button]'));

    expect(document.querySelector('#paneHeaderplugin-find-collection-filter-pane-pane-title')).not.toBeInTheDocument();
    expect(document.querySelector('[data-test-expand-filter-pane-button]')).toBeInTheDocument();

    await userEvent.hover(document.querySelector('[data-test-expand-filter-pane-button]'));

    const filterCountDisplay = document.querySelector('#expand-filter-pane-button-tooltip-sub');
    expect(filterCountDisplay).toBeInTheDocument();

    const expandFilterButton = document.querySelector('[data-test-expand-filter-pane-button]');

    const badge = expandFilterButton.querySelector('.badge .label');
    expect(badge).toHaveTextContent('2');

    await userEvent.click(expandFilterButton);

    expect(document.querySelector('#paneHeaderplugin-find-collection-filter-pane-pane-title')).toBeInTheDocument();
  });
});
