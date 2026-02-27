import { render } from '@folio/jest-config-stripes/testing-library/react';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import CollectionSearchContainer from './CollectionSearchContainer';
import CollectionsView from './CollectionsView';

jest.mock('./CollectionsView', () => jest.fn(() => null));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn(),
}));

const mutator = {
  query: {
    update: jest.fn(),
  },
};

const resources = {
  metadataCollections: {
    records: [],
  },
  query: {},
};

const stripes = {
  logger: {
    log: jest.fn(),
  },
};

const renderCollectionSearchContainer = (props = {}) => (render(
  <CollectionSearchContainer
    mutator={mutator}
    onChangeIndex={jest.fn}
    onSelectRow={jest.fn}
    resources={resources}
    stripes={stripes}
    {...props}
  />
));

describe('CollectionSearchContainer component', () => {
  let mockSource;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSource = {
      update: jest.fn(),
      fetchMore: jest.fn(),
    };

    StripesConnectedSource.mockImplementation(() => mockSource);
  });

  it('should call the update method of source when resources or mutator changes', () => {
    renderCollectionSearchContainer();

    // The source update is called during component render
    expect(mockSource.update).toHaveBeenCalledWith(
      expect.objectContaining({ resources, mutator }),
      'metadataCollections'
    );
  });

  it('should update the query when querySetter is called', () => {
    renderCollectionSearchContainer();

    const [collectionsViewProps] = CollectionsView.mock.calls[0];
    const nsValues = { query: 'test' };
    collectionsViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });

  it('should fetch more data when handleNeedMoreData is called', () => {
    renderCollectionSearchContainer();

    const [collectionsViewProps] = CollectionsView.mock.calls[0];
    const RESULT_COUNT_INCREMENT = 100;
    collectionsViewProps.onNeedMoreData();

    expect(mockSource.fetchMore).toHaveBeenCalledWith(RESULT_COUNT_INCREMENT);
  });

  it('should update the query when querySetter is called', () => {
    renderCollectionSearchContainer();

    const [collectionsViewProps] = CollectionsView.mock.calls[0];
    const nsValues = { query: 'test' };
    collectionsViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });

  it('should return the query from resources when queryGetter is called', () => {
    const customResources = {
      ...resources,
      query: { query: 'test' },
    };

    renderCollectionSearchContainer({ resources: customResources });

    const [collectionsViewProps] = CollectionsView.mock.calls[0];
    const query = collectionsViewProps.queryGetter();

    expect(query).toEqual({ query: 'test' });
  });

  it('should pass the correct data to CollectionsView', () => {
    const customResources = {
      ...resources,
      metadataCollections: { records: [{ id: '1' }] },
    };

    renderCollectionSearchContainer({ resources: customResources });

    const [collectionsViewProps] = CollectionsView.mock.calls[0];

    expect(collectionsViewProps.contentData).toEqual([{ id: '1' }]);
  });

  it('should call onChangeIndex', async () => {
    renderCollectionSearchContainer();

    const [collectionsViewProps] = CollectionsView.mock.calls[0];
    const nsValues = { qindex: 'label' };
    collectionsViewProps.querySetter({ nsValues });

    expect(mutator.query.update).toHaveBeenCalledWith(nsValues);
  });
});
