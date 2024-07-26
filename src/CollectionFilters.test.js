import { render } from '@folio/jest-config-stripes/testing-library/react';

import CollectionFilters from './CollectionFilters';

const data = {
  mdSources: [{ id: 'test', label: 'test' }],
};

const mockFilterHandlers = {
  clearGroup: jest.fn(),
  state: jest.fn(),
};

const renderCollectionFilter = () => (
  render(
    <CollectionFilters
      activeFilters={{}}
      filterData={data}
      filterHandlers={mockFilterHandlers}
    />,
  )
);

describe('CollectionFilters component', () => {
  it('should display filters', () => {
    renderCollectionFilter();

    expect(document.querySelector('#filter-accordion-mdSource')).toBeDefined();
    expect(document.querySelector('#filter-accordion-freeContent')).toBeDefined();
    expect(document.querySelector('#filter-accordion-permitted')).toBeDefined();
    expect(document.querySelector('#filter-accordion-selected')).toBeDefined();
    expect(document.querySelector('#filter-accordion-assigned')).toBeDefined();
  });
});
