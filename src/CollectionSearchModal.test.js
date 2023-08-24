import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import translationsProperties from '../test/jest/helpers/translationsProperties';
import CollectionSearchModal from './CollectionSearchModal';

jest.mock('./CollectionSearchContainer', () => {
  return ({ selectRecordsContainer }) => (
    <>
      <button type="button" onClick={() => selectRecordsContainer({}, {})}>
        SelectCollection
      </button>
    </>
  );
});

const onCloseModal = jest.fn();
const selectRecordsModal = jest.fn();

const renderCollectionSearchModal = (open = true, onClose = onCloseModal) =>
  renderWithIntl(
    <CollectionSearchModal selectRecordsModal={selectRecordsModal} onClose={onClose} open={open} />,
    translationsProperties
  );

describe('CollectionSearchModal component', () => {
  it('should display collection search modal', () => {
    renderCollectionSearchModal();

    expect(
      screen.getByText('ui-plugin-find-finc-metadata-collection.modal.label')
    ).toBeInTheDocument();
  });

  it('should not display collection search modal', () => {
    renderCollectionSearchModal(false);

    expect(
      screen.queryByText('ui-plugin-find-finc-metadata-collection.modal.label')
    ).not.toBeInTheDocument();
  });

  describe('Close collection search modal', () => {
    it('should close collection search modal', async () => {
      renderCollectionSearchModal(true, onCloseModal);
      await user.click(screen.getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(onCloseModal).toHaveBeenCalled();
    });
  });

  describe('Select collection', () => {
    it('should select collection and close modal', async () => {
      renderCollectionSearchModal(true, onCloseModal);
      await user.click(screen.getByText('SelectCollection'));

      expect(selectRecordsModal).toHaveBeenCalled();
      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
