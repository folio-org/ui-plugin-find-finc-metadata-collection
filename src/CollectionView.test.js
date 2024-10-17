import { MemoryRouter } from 'react-router-dom';

import { ModuleHierarchyProvider, StripesContext, useStripes } from '@folio/stripes/core';
import { screen, within } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionsView from './CollectionsView';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };

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
  isEditable,
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
            isEditable={isEditable}
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

describe('CollectionView is editable', () => {
  let stripes;
  let renderWithIntlResult = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
    renderWithIntlResult = renderCollectionsView(stripes, sourcePending, true, ARRAY_COLLECTION);
  });

  it('filter pane and searchField should be visible', () => {
    const searchAndFilterPane = screen.getByTestId('find-collection-filter-pane');
    const inputField = within(searchAndFilterPane).getByRole('searchbox');
    expect(screen.getByTestId('find-collection-filter-pane')).toBeInTheDocument();
    expect(inputField).toBeInTheDocument();
  });

  it('search field should be active element', () => {
    const focusedElem = document.activeElement;
    expect(focusedElem?.id).toBe('collectionSearchField');
  });

  it('buttons for submit and reset should be visible', () => {
    const searchAndFilterPane = screen.getByTestId('find-collection-filter-pane');
    const submitSearch = within(searchAndFilterPane).getByRole('button', { name: 'Search' });
    expect(submitSearch).toBeInTheDocument();
    expect(within(searchAndFilterPane).getByRole('button', { name: 'Icon' })).toBeInTheDocument();
    expect(submitSearch).toHaveAttribute('disabled');
  });

  test('enter search string should enable submit button', async () => {
    const searchAndFilterPane = screen.getByTestId('find-collection-filter-pane');
    const submitSearch = within(searchAndFilterPane).getByRole('button', { name: 'Search' });
    expect(submitSearch).toHaveAttribute('disabled');

    const inputField = within(searchAndFilterPane).getByRole('searchbox');
    await userEvent.type(inputField, 'collection');
    expect(submitSearch).toBeEnabled();
  });

  test('entering search sting and deleting it', async () => {
    const data = [
      {
        collectionId: 'coe-123',
        label: 'Test collection 1',
        permitted: 'yes',
        selected: 'yes',
      }
    ];

    const searchAndFilterPane = screen.getByTestId('find-collection-filter-pane');
    const inputField = within(searchAndFilterPane).getByRole('searchbox');
    await userEvent.type(inputField, 'Test collection 1');

    const submitSearch = within(searchAndFilterPane).getByRole('button', { name: 'Search' });
    expect(submitSearch).toBeEnabled();
    await userEvent.click(submitSearch);

    renderCollectionsView(
      stripes,
      sourceLoaded,
      true,
      data,
      renderWithIntlResult.rerender
    );

    expect(screen.getByText('Test collection 1')).toBeInTheDocument();
    expect(screen.queryByText('Test collection 2')).not.toBeInTheDocument();

    expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(1);

    await userEvent.clear(inputField);

    renderCollectionsView(
      stripes,
      sourceLoaded,
      true,
      ARRAY_COLLECTION,
      renderWithIntlResult.rerender
    );

    expect(screen.getByText('Test collection 1')).toBeInTheDocument();
    expect(screen.getByText('Test collection 2')).toBeInTheDocument();

    expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(2);
  });

  test('if collapse filter pane is working', async () => {
    const searchAndFilterPane = screen.getByTestId('find-collection-filter-pane');
    const searchAndFilterHeadling = within(searchAndFilterPane).getByRole('heading', { name: 'Search & filter' });
    const collapseFilterButton = within(searchAndFilterPane).getByRole('button', { name: 'Collapse Search & filter pane' });

    expect(searchAndFilterHeadling).toBeInTheDocument();
    expect(collapseFilterButton).toBeInTheDocument();

    await userEvent.click(within(searchAndFilterPane).getByRole('button', { name: 'Icon' }));
    await userEvent.click(collapseFilterButton);

    expect(searchAndFilterHeadling).not.toBeInTheDocument();

    const expandFilterButton = screen.getByRole('button', { name: 'Expand Search & filter pane' });
    expect(expandFilterButton).toBeInTheDocument();

    const filterCountDisplay = document.querySelector('#expand-filter-pane-button-tooltip-sub');
    expect(filterCountDisplay).toBeInTheDocument();

    const badge = expandFilterButton.querySelector('.badge .label');
    expect(badge).toHaveTextContent('2');

    await userEvent.click(expandFilterButton);

    expect(within(screen.getByTestId('find-collection-filter-pane')).getByRole('heading', { name: 'Search & filter' })).toBeInTheDocument();
  });

  it('should show a certain amount of results and all columns', async () => {
    await userEvent.click(document.querySelector('#clickable-reset-all'));

    expect(document.querySelectorAll('#list-collections .mclRowContainer > [role=row]').length).toEqual(2);

    const listPane = screen.getByTestId('find-collection-list-pane');
    expect(within(listPane).getByText('Name')).toBeInTheDocument();
    expect(within(listPane).getByText('Metadata source')).toBeInTheDocument();
    expect(within(listPane).getByText('Usage permitted')).toBeInTheDocument();
    expect(within(listPane).getByText('Free content')).toBeInTheDocument();
  });

  test('if select all and click save button is calling function', async () => {
    const selectAllButton = document.querySelector('[data-test-find-records-modal-select-all]');
    expect(selectAllButton).not.toBeChecked();
    await userEvent.click(selectAllButton);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSaveMultiple).toHaveBeenCalled();
  });

  test('if select one collection and click save button is calling function', async () => {
    const checkbox = document.querySelector('#list-collections .mclRowContainer [data-row-index="row-0"] input[type="checkbox"]');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(checkbox).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(checkbox);
    await userEvent.click(saveButton);

    expect(onSaveMultiple).toHaveBeenCalled();
  });
});

describe('CollectionView NOT editable', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
    renderCollectionsView(stripes, sourceLoaded, false, ARRAY_COLLECTION);
  });

  test('if save button is disabled', async () => {
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const selectAllButton = document.querySelector('[data-test-find-records-modal-select-all]');

    expect(selectAllButton).not.toBeChecked();
    await userEvent.click(selectAllButton);
    await userEvent.click(saveButton);

    expect(saveButton).toBeDisabled();
  });
});
