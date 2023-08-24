import { render } from '@testing-library/react';

import CollectionSearchContainer from './CollectionSearchContainer';

jest.mock('./CollectionsView', () => {
  return () => <span>CollectionsView</span>;
});

const renderCollectionSearchContainer = (mutator) => (render(
  <CollectionSearchContainer
    mutator={mutator}
    onClose={jest.fn}
  />,
));

describe('CollectionSearchContainer component', () => {
  let mutator;

  beforeEach(() => {
    mutator = { query: { update: jest.fn() } };
  });

  it('should update query when plugin is open', async () => {
    renderCollectionSearchContainer(mutator);

    expect(mutator.query.update).toHaveBeenCalled();
  });
});
