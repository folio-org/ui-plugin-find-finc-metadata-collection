import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal } from '@folio/stripes/components';

import CollectionSearchContainer from './CollectionSearchContainer';
import css from './CollectionSearch.css';

const CollectionSearchModal = ({
  collectionIds,
  filterId,
  isEditable,
  modalRef,
  onClose,
  open,
  selectRecordsModal = noop,
  ...props
}) => {
  const backupModalRef = useRef(null);
  const internalModalRef = modalRef || backupModalRef;

  const passRecordsOut = records => {
    selectRecordsModal(records);
  };

  return (
    <Modal
      contentClass={css.modalContent}
      dismissible
      enforceFocus={false}
      label={<FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.label" />}
      onClose={onClose}
      open={open}
      ref={internalModalRef}
      size="large"
    >
      <CollectionSearchContainer
        collectionIds={collectionIds}
        filterId={filterId}
        isEditable={isEditable}
        onClose={onClose}
        selectRecordsContainer={passRecordsOut}
        {...props}
      />
    </Modal>
  );
};

CollectionSearchModal.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  isEditable: PropTypes.bool,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  selectRecordsModal: PropTypes.func,
};

export default CollectionSearchModal;
