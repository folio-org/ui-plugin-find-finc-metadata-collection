import { render } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

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
      activeFilters={{
        permitted: 'yes',
        selected: 'yes',
      }}
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

  it('should call clearGroup of the correct filterGroup if clicking clear button', async () => {
    renderCollectionFilter();
    const selectedFilter = document.querySelector('#filter-accordion-selected');
    expect(selectedFilter).toBeInTheDocument();

    const clearselectedFilter = selectedFilter.querySelector('button[icon="times-circle-solid"]');
    expect(clearselectedFilter).toBeInTheDocument();

    await userEvent.click(clearselectedFilter);
    expect(mockFilterHandlers.clearGroup).toHaveBeenCalledWith('selected');
  });
});
