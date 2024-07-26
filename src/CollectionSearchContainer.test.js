import { render } from '@folio/jest-config-stripes/testing-library/react';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import CollectionSearchContainer from './CollectionSearchContainer';

jest.mock('./CollectionsView', () => jest.fn(() => null));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  StripesConnectedSource: jest.fn()
}));

const mutator = {
  query: {
    update: jest.fn(),
  }
};

const resources = {
  metadataCollections: {
    records: []
  },
  query: {}
};

const stripes = {
  logger: {
    log: jest.fn()
  }
};

const renderCollectionSearchContainer = (props = {}) => (render(
  <CollectionSearchContainer
    mutator={mutator}
    resources={resources}
    stripes={stripes}
    {...props}
  />,
));

describe('CollectionSearchContainer component', () => {
  let mockSource;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSource = {
      update: jest.fn(),
      fetchMore: jest.fn()
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
});
