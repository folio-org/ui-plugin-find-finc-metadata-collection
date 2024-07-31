import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';
import contains from 'dom-helpers/query/contains';

import { Button, Icon } from '@folio/stripes/components';

import CollectionSearchModal from './CollectionSearchModal';

const CollectionSearch = ({
  buttonId = 'clickable-plugin-find-finc-metadata-collection',
  collectionIds,
  filterId,
  isEditable,
  marginBottom0,
  renderTrigger,
  searchButtonStyle = 'primary noRightRadius',
  searchLabel,
  selectRecords = noop,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalTrigger = useRef(null);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false, () => {
      if (modalRef.current && modalTrigger.current) {
        if (contains(modalRef.current, document.activeElement)) {
          modalTrigger.current.focus();
        }
      }
    });
  };

  const renderTriggerButton = () => {
    return renderTrigger({
      buttonRef: modalTrigger,
      onClick: openModal,
    });
  };

  const passRecordsOut = records => {
    selectRecords(records);
  };

  return (
    <>
      {renderTrigger ?
        renderTriggerButton() :
        <FormattedMessage id="ui-plugin-find-finc-metadata-collection.searchButton.title">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonRef={modalTrigger}
              buttonStyle={searchButtonStyle}
              id={buttonId}
              key="searchButton"
              marginBottom0={marginBottom0}
              onClick={openModal}
            >
              {searchLabel || <Icon icon="search" color="#fff" />}
            </Button>
          )}
        </FormattedMessage>}
      <CollectionSearchModal
        collectionIds={collectionIds}
        filterId={filterId}
        isEditable={isEditable}
        modalRef={modalRef}
        open={isModalOpen}
        onClose={closeModal}
        selectRecordsModal={passRecordsOut}
        {...props}
      />
    </ >
  );
};

CollectionSearch.propTypes = {
  buttonId: PropTypes.string,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  filterId: PropTypes.string,
  isEditable: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  selectRecords: PropTypes.func,
  marginBottom0: PropTypes.bool,
};

export default CollectionSearch;
