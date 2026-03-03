import contains from 'dom-helpers/query/contains';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import {
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

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
              key="searchButton"
              aria-label={ariaLabel}
              buttonRef={modalTrigger}
              buttonStyle={searchButtonStyle}
              id={buttonId}
              marginBottom0={marginBottom0}
              onClick={openModal}
            >
              {searchLabel || <Icon color="#fff" icon="search" />}
            </Button>
          )}
        </FormattedMessage>}
      <CollectionSearchModal
        collectionIds={collectionIds}
        filterId={filterId}
        isEditable={isEditable}
        modalRef={modalRef}
        onClose={closeModal}
        open={isModalOpen}
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
  marginBottom0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  selectRecords: PropTypes.func,
};

export default CollectionSearch;
