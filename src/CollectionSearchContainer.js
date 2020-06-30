import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import CollectionsView from './CollectionsView';
import filterConfig from './filterConfigData';

const INITIAL_RESULT_COUNT = 100000;
const RESULT_COUNT_INCREMENT = 100;

class CollectionSearchContainer extends React.Component {
  static manifest = Object.freeze({
    metadataCollections: {
      type: 'okapi',
      records: 'fincSelectMetadataCollections',
      recordsRequired: '%{resultCount}',
      perRequest: 100000,
      path: 'finc-select/metadata-collections',
      resourceShouldRefresh: true,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*")',
            {
              'Collection Name': 'label',
            },
            filterConfig,
            // show all records if no filter is selected
            // 2
          ),
        },
        staticFallback: { params: {} },
      },
    },
    mdSources: {
      type: 'okapi',
      records: 'tinyMetadataSources',
      path: 'finc-config/tiny-metadata-sources',
      resourceShouldRefresh: true,
    },
    filterToCollections: {
      type: 'okapi',
      path: 'finc-select/filters/!{filterId}/collections',
      records: 'collectionIds',
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    filterId: PropTypes.string,
    collectionIds: PropTypes.arrayOf(PropTypes.object),
    isEditable: PropTypes.bool,
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
      okapi: PropTypes.object,
    }),
    selectRecordsContainer: PropTypes.func,
  };

  static defaultProps = {
    selectRecordsContainer: _.noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      assignedStatus: '',
    };

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.collection = new StripesConnectedSource(
      this.props,
      this.logger,
      'metadataCollections'
    );

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.query.update({
      filters: 'permitted.yes,selected.yes',
    });
  }

  querySetter = ({ nsValues }) => {
    // Check if query contains 'assigned'.
    // If this is the case, remove the assigned filter from the query, and set it to this component's state.
    // Attention: This is hacky!
    const regexp = /,?assigned\.(yes|no)/gi;
    const filters = _.get(nsValues, 'filters', '');
    if (regexp.test(filters)) {
      let withoutAssigned = filters.replace(regexp, '');
      withoutAssigned = withoutAssigned.replace(/(^,)|(,$)/g, '');
      nsValues.filters = withoutAssigned;

      const assignedStatus = filters.match(regexp);
      this.setState({
        assignedStatus
      });
    } else {
      this.setState({
        assignedStatus: '',
      });
    }
    this.props.mutator.query.update(nsValues);
  };

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  };

  handleNeedMoreData = () => {
    if (this.collection) {
      this.collection.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  onChangeIndex = (e) => {
    const qindex = e.target.value;

    this.props.mutator.query.update({ qindex });
  };

  passRecordsOut = (records) => {
    this.props.selectRecordsContainer(records);
  };

  render() {
    const { onSelectRow, resources } = this.props;
    const contentData = _.get(resources, 'metadataCollections.records', []);
    const filterToCollections = _.get(resources, 'filterToCollections.records', []);
    if (this.collection) {
      this.collection.update(this.props, 'metadataCollections');
    }

    let filtered = contentData;
    // Here we filter collections is they are assigned or unassigned
    if (_.findIndex(this.state.assignedStatus, s => s.includes('yes')) >= 0 && _.findIndex(this.state.assignedStatus, s => s.includes('no')) === -1) {
      filtered = contentData.filter(c => filterToCollections.includes(c.id));
    } else if (_.findIndex(this.state.assignedStatus, s => s.includes('no')) >= 0 && _.findIndex(this.state.assignedStatus, s => s.includes('yes')) === -1) {
      filtered = contentData.filter(c => !filterToCollections.includes(c.id));
    }

    return (
      <CollectionsView
        assignedStatus={this.state.assignedStatus}
        filterId={this.props.filterId}
        collectionIds={this.props.collectionIds}
        isEditable={this.props.isEditable}
        contentData={contentData}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        collection={this.collection}
        onChangeIndex={this.onChangeIndex}
        filterData={{
          mdSources: _.get(this.props.resources, 'mdSources.records', []),
        }}
        filtered={filtered}
        filterToCollections={_.get(
          resources,
          'filterToCollections.records',
          []
        )}
        onClose={this.props.onClose}
        stripes={this.props.stripes}
        onSaveMultiple={this.passRecordsOut}
      />
    );
  }
}

export default stripesConnect(CollectionSearchContainer, {
  dataKey: 'find_collection',
});
