import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';

import CollectionSearchContainer from './CollectionSearchContainer';
import css from './CollectionSearch.css';

class CollectionSearchModal extends Component {
  static propTypes = {
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    filterId: PropTypes.string,
    isEditable: PropTypes.bool,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool,
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
        dismissible
        enforceFocus={false}
        label={<FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.label" />}
        onClose={this.props.onClose}
        open={this.props.open}
        ref={this.modalRef}
        size="large"
      >
        <CollectionSearchContainer
          collectionIds={this.props.collectionIds}
          filterId={this.props.filterId}
          isEditable={this.props.isEditable}
          onClose={this.props.onClose}
          selectRecordsContainer={this.passRecordsOut}
          {...this.props}
        />
      </Modal>
    );
  }
}

export default CollectionSearchModal;
