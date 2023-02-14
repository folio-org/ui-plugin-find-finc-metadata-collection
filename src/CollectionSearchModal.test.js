import user from '@testing-library/user-event';

import translationsProperties from '../test/jest/helpers/translationsProperties';
import renderWithIntl from '../test/jest/helpers/renderWithIntl';
import CollectionSearchModal from './CollectionSearchModal';

jest.mock('./CollectionSearchContainer', () => {
  // eslint-disable-next-line react/prop-types
  return ({ selectRecordsContainer }) => (
    <>
      <button
        type="button"
        onClick={() => selectRecordsContainer({}, {})}
      >
        SelectCollection
      </button>
    </>
  );
});

const onCloseModal = jest.fn();
const selectRecordsModal = jest.fn();

const renderCollectionSearchModal = (
  open = true,
  onClose = onCloseModal,
) => (
  renderWithIntl(
    <CollectionSearchModal
      selectRecordsModal={selectRecordsModal}
      onClose={onClose}
      open={open}
    />,
    translationsProperties
  )
);

describe('CollectionSearchModal component', () => {
  it('should display collection search modal', () => {
    const { getByText } = renderCollectionSearchModal();

    expect(getByText('ui-plugin-find-finc-metadata-collection.modal.label')).toBeDefined();
  });

  it('should not display collection search modal', () => {
    const { queryByText } = renderCollectionSearchModal(false);

    expect(queryByText('ui-plugin-find-finc-metadata-collection.modal.label')).toBeNull();
  });

  describe('Close collection search modal', () => {
    it('should close collection search modal', () => {
      const { getByRole } = renderCollectionSearchModal(true, onCloseModal);
      user.click(getByRole('button', { name: 'stripes-components.dismissModal' }));

      expect(onCloseModal).toHaveBeenCalled();
    });
  });

  describe('Select collection', () => {
    it('should select collection and close modal', () => {
      const { getByText } = renderCollectionSearchModal(true, onCloseModal, selectRecordsModal);
      user.click(getByText('SelectCollection'));

      expect(selectRecordsModal).toHaveBeenCalled();
      expect(onCloseModal).toHaveBeenCalled();
    });
  });
});
