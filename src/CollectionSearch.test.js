import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionSearch from './CollectionSearch';

jest.mock('./CollectionSearchModal', () => {
  return () => <span>CollectionSearchModal</span>;
});

jest.mock('./CollectionSearchModal', () => jest.fn(({ open, onClose }) => (
  <div>
    {open && (
      <div>
        <p>CollectionSearchModal</p>
        <button aria-label="Dismiss modal" onClick={onClose} type="button" />
      </div>
    )}
  </div>
)));

const closeModal = jest.fn();
const isOpen = true;

const renderCollectionSearch = (renderTrigger) => renderWithIntl(
  <CollectionSearch
    onClose={closeModal}
    open={isOpen}
    renderTrigger={renderTrigger}
  />
);

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

  it('should call close modal', async () => {
    renderCollectionSearch();
    const closeButton = screen.getByRole('button', { name: /Dismiss modal/i });
    await user.click(closeButton);

    expect(closeModal).toHaveBeenCalled();
  });
});
