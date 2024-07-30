import { MemoryRouter } from 'react-router-dom';

import { ModuleHierarchyProvider, StripesContext, useStripes } from '@folio/stripes/core';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionsView from './CollectionsView';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

const ARRAY_COLLECTION = [
  {
    collectionId: 'coe-123',
    label: 'Test collection 1',
    permitted: 'yes',
    selected: 'yes',
  },
  {
    collectionId: 'coe-124',
    label: 'Test collection 2',
    permitted: 'yes',
    selected: 'yes',
  }
];

const tinySources = [
  {
    'id': '6dd325f8-b1d5-4568-a0d7-aecf6b8d6697',
    'label': 'Cambridge University Press Journals'
  },
  {
    'id': '8ac1e1cf-5128-46b9-b57b-52bbfca7261b',
    'label': 'Oxford Scholarship Online'
  }
];

const onSearchComplete = jest.fn();
const isEmptyMessage = jest.fn();
const onCloseModal = jest.fn();
const onSaveMultiple = jest.fn();
const history = {};

const renderCollectionsView = (
  stripes,
  props,
  metadatacollections,
  rerender
) => (
  renderWithIntl(
    <MemoryRouter>
      <StripesContext.Provider value={stripes}>
        <ModuleHierarchyProvider module="@folio/plugin-find-finc-metadata-collection">
          <CollectionsView
            contentData={metadatacollections}
            filtered={metadatacollections}
            selectedRecordId=""
            onNeedMoreData={jest.fn()}
            isEmptyMessage={isEmptyMessage}
            filterData={{ mdSources: tinySources }}
            queryGetter={jest.fn()}
            querySetter={jest.fn()}
            searchString=""
            onClose={onCloseModal}
            onSaveMultiple={onSaveMultiple}
            visibleColumns={['isChecked', 'label', 'mdSource', 'permitted', 'freeContent']}
            history={history}
            onSearchComplete={onSearchComplete}
            location={{ pathname: '', search: '' }}
            {...props}
          />
        </ModuleHierarchyProvider>
      </StripesContext.Provider>
    </MemoryRouter>,
    rerender
  )
);

jest.unmock('react-intl');

describe('CollectionView', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
    renderCollectionsView(stripes, sourceLoaded, ARRAY_COLLECTION);
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

    await userEvent.click(document.querySelector('#clickable-reset-all'));
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

describe('click "active" filter and load new results', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('render with results', () => {
    it('should show a certain amount of results and all columns', async () => {
      renderCollectionsView(stripes, sourcePending, ARRAY_COLLECTION);

      await userEvent.click(document.querySelector('#clickable-reset-all'));

      expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(2);

      expect(document.querySelector('#list-column-label')).toBeInTheDocument();
      expect(document.querySelector('#list-column-mdsource')).toBeInTheDocument();
      expect(document.querySelector('#list-column-permitted')).toBeInTheDocument();
      expect(document.querySelector('#list-column-freecontent')).toBeInTheDocument();
    });
  });
});
