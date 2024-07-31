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
        permitted: ['yes'],
        selected: ['yes'],
        mdSource: ['testid'],
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

  test('select and clear sources filter', async () => {
    renderCollectionFilter();
    const mdSourceFilter = document.querySelector('#filter-accordion-mdSource');
    expect(mdSourceFilter).toBeInTheDocument();

    // open selectbox
    await userEvent.click(document.querySelector('#mdSource-filter'));

    // select first mdSource in selectbox
    const firstMdSource = document.querySelector('#sl-container-mdSource-filter ul[aria-labelledby="sl-label-mdSource-filter"] li:first-child');
    expect(firstMdSource).toBeInTheDocument();
    await userEvent.click(firstMdSource);

    const clearMdSourceFilter = mdSourceFilter.querySelector('button[icon="times-circle-solid"]');
    await expect(clearMdSourceFilter).toBeInTheDocument();

    await userEvent.click(clearMdSourceFilter);
    expect(mockFilterHandlers.clearGroup).toHaveBeenCalledWith('mdSource');
  });
});
