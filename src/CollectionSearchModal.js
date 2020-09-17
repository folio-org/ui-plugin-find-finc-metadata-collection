import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from '@folio/stripes/components';

import CollectionSearchContainer from './CollectionSearchContainer';
import css from './CollectionSearch.css';

class CollectionSearchModal extends Component {
  static propTypes = {
    filterId: PropTypes.string,
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    isEditable: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    // selectCollection: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
    dataKey: PropTypes.string,
    selectRecordsModal: PropTypes.func,
  };

  static defaultProps = {
    selectRecordsModal: _.noop,
  }

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
  }

  passRecordsOut = records => {
    this.props.selectRecordsModal(records);
  }

  render() {
    return (
      <Modal
        contentClass={css.modalContent}
        enforceFocus={false}
        onClose={this.props.onClose}
        size="large"
        open={this.props.open}
        ref={this.modalRef}
        label={
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.label" />
        }
        dismissible
      >
        <CollectionSearchContainer
          {...this.props}
          filterId={this.props.filterId}
          collectionIds={this.props.collectionIds}
          isEditable={this.props.isEditable}
          onClose={this.props.onClose}
          selectRecordsContainer={this.passRecordsOut}
        />
      </Modal>
    );
  }
}

export default CollectionSearchModal;
