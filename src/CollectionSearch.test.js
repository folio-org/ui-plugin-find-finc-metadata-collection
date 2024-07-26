import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import CollectionSearch from './CollectionSearch';

jest.mock('./CollectionSearchModal', () => {
  return () => <span>CollectionSearchModal</span>;
});

const renderCollectionSearch = (renderTrigger) =>
  renderWithIntl(<CollectionSearch renderTrigger={renderTrigger} />, translationsProperties);

describe('CollectionSearch component', () => {
  it('should display search collection button', () => {
    renderCollectionSearch();

    expect(document.querySelector('#clickable-plugin-find-finc-metadata-collection')).toBeDefined();
  });

  it('should render trigger button', () => {
    const renderTrigger = jest.fn();
    renderCollectionSearch(renderTrigger);

    expect(renderTrigger).toHaveBeenCalled();
  });

  it('should open collection search modal', async () => {
    renderCollectionSearch();
    await user.click(document.querySelector('#clickable-plugin-find-finc-metadata-collection'));

    expect(screen.getByText('CollectionSearchModal')).toBeInTheDocument();
  });
});
