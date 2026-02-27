import {
  findIndex,
  get,
  noop,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import CollectionsView from './CollectionsView';
import filterConfig from './filterConfigData';

const INITIAL_RESULT_COUNT = 100000;
const RESULT_COUNT_INCREMENT = 100;

const CollectionSearchContainer = ({
  collectionIds,
  isEditable,
  mutator,
  onClose,
  resources,
  selectRecordsContainer = noop,
  stripes,
}) => {
  const [assignedStatus, setAssignedStatus] = useState('');

  const searchField = useRef(null);

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const collection = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'metadataCollections');
  const contentData = get(resources, 'metadataCollections.records', []);
  const filterToCollections = get(resources, 'filterToCollections.records', []);

  if (collection) {
    collection.update({ resources, mutator }, 'metadataCollections');
  }

  const querySetter = ({ nsValues }) => {
    // Check if query contains 'assigned'.
    // If this is the case, remove the assigned filter from the query, and set it to this component's state.
    // Attention: This is hacky!
    const regexp = /,?assigned\.(yes|no)/gi;
    const filters = get(nsValues, 'filters', '');

    if (regexp.test(filters)) {
      let withoutAssigned = filters.replace(regexp, '');
      withoutAssigned = withoutAssigned.replace(/(^,)|(,$)/g, '');
      nsValues.filters = withoutAssigned;

      const assignedStatusRegexp = filters.match(regexp);
      setAssignedStatus(assignedStatusRegexp);
    } else {
      setAssignedStatus('');
    }

    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(resources, 'query', {});
  };

  const handleNeedMoreData = () => {
    if (collection) {
      collection.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  const passRecordsOut = (records) => {
    selectRecordsContainer(records);
  };

  let filtered = contentData;

  // Here we filter collections is they are assigned or unassigned
  if (
    findIndex(assignedStatus, s => s.includes('yes')) >= 0 &&
    findIndex(assignedStatus, s => s.includes('no')) === -1
  ) {
    filtered = contentData.filter(c => filterToCollections.includes(c.id));
  } else if (
    findIndex(assignedStatus, s => s.includes('no')) >= 0 &&
    findIndex(assignedStatus, s => s.includes('yes')) === -1
  ) {
    filtered = contentData.filter(c => !filterToCollections.includes(c.id));
  }

  return (
    <CollectionsView
      collectionIds={collectionIds}
      contentData={contentData}
      filterData={{
        mdSources: get(resources, 'mdSources.records', []),
      }}
      filtered={filtered}
      isEditable={isEditable}
      onClose={onClose}
      onNeedMoreData={handleNeedMoreData}
      onSaveMultiple={passRecordsOut}
      queryGetter={queryGetter}
      querySetter={querySetter}
    />
  );
};

CollectionSearchContainer.manifest = Object.freeze({
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
          filterConfig
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
  query: {
    initialValue: {
      query: '',
      filters: 'permitted.yes,selected.yes',
      sort: '',
    },
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
});

CollectionSearchContainer.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
  mutator: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object,
  selectRecordsContainer: PropTypes.func,
  stripes: PropTypes.shape({
    logger: PropTypes.object,
  }),
};

export default stripesConnect(CollectionSearchContainer, {
  dataKey: 'find_collection',
});
