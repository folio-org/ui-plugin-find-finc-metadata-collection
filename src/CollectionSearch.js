import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

import {
  Button,
  Icon
} from '@folio/stripes/components';

import CollectionSearchModal from './CollectionSearchModal';

class CollectionSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalTrigger = React.createRef();
    this.modalRef = React.createRef();
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    this.setState({
      openModal: false,
    }, () => {
      if (this.modalRef.current && this.modalTrigger.current) {
        if (contains(this.modalRef.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  renderTriggerButton() {
    const { renderTrigger } = this.props;

    return renderTrigger({
      buttonRef: this.modalTrigger,
      onClick: this.openModal,
    });
  }

  passRecordsOut = records => {
    this.props.selectRecords(records);
  }

  render() {
    const {
      buttonId,
      marginBottom0,
      renderTrigger,
      searchButtonStyle,
      searchLabel,
    } = this.props;

    return (
      <React.Fragment>
        {renderTrigger ?
          this.renderTriggerButton() :
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.searchButton.title">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonRef={this.modalTrigger}
                buttonStyle={searchButtonStyle}
                id={buttonId}
                key="searchButton"
                marginBottom0={marginBottom0}
                onClick={this.openModal}
              >
                {searchLabel || <Icon icon="search" color="#fff" />}
              </Button>
            )}
          </FormattedMessage>}
        <CollectionSearchModal
          collectionIds={this.props.collectionIds}
          filterId={this.props.filterId}
          isEditable={this.props.isEditable}
          modalRef={this.modalRef}
          open={this.state.openModal}
          onClose={this.closeModal}
          selectRecordsModal={this.passRecordsOut}
          {...this.props}
        />
      </React.Fragment>
    );
  }
}

CollectionSearch.defaultProps = {
  buttonId: 'clickable-plugin-find-finc-metadata-collection',
  searchButtonStyle: 'primary noRightRadius',
  selectRecords: _.noop,
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
