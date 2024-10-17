import PropTypes from 'prop-types';
import { get, keys, mapKeys, noop, upperFirst } from 'lodash';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Icon,
  MultiColumnList,
  NoValue,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import CollectionFilters from './CollectionFilters';
import css from './CollectionSearch.css';
import cssNoResults from './NoResultsMessage.css';

const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};

const CollectionsView = ({
  collectionIds = [],
  contentData,
  contentRef,
  filterData = {},
  filtered,
  isEditable,
  onClose,
  onNeedMoreData,
  onSaveMultiple = noop,
  queryGetter,
  querySetter,
  searchField,
}) => {
  const [checkedMap, setCheckedMap] = useState({});
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    if (collectionIds.length > 0) {
      const arrayWithIds = collectionIds[0].collectionIds;
      // ["9a2427cd-4110-4bd9-b6f9-e3475631bbac"]

      const myObj = mapKeys(arrayWithIds);
      setCheckedMap(myObj);
    }
    // {6dd325f8-b1d5-4568-a0d7-aecf6b8d6123: {…}, 9a2427cd-4110-4bd9-b6f9-e3475631bbac: {…}}
  }, [collectionIds]);

  const query = queryGetter() || {};
  const sortOrder = query.sort || '';
  const checkedRecordsLength = checkedMap ? Object.keys(checkedMap).length : 0;
  const visibleColumns = ['isChecked', 'label', 'mdSource', 'permitted', 'freeContent'];

  const columnWidths = {
    isChecked: 40,
    label: 270,
    mdSource: 270,
    permitted: 150,
    freeContent: 150
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible((curState) => !curState);
  };

  // fade in / out the filter menu
  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  // counting records of result list
  const renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.length : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  const toggleAll = () => {
    const isAllCheckedCurr = !isAllChecked;
    const checkedMapCurr = reduceCheckedRecords(contentData, isAllCheckedCurr);

    setCheckedMap(checkedMapCurr);
    setIsAllChecked(isAllCheckedCurr);
  };

  const toggleRecord = toggledRecord => {
    const { id } = toggledRecord;
    const wasChecked = Boolean(checkedMap[id]);
    const checkedMapCurr = { ...checkedMap };

    if (wasChecked) {
      delete checkedMapCurr[id];
    } else {
      checkedMapCurr[id] = toggledRecord;
    }
    const isAllCheckedCurr = contentData.every(record => Boolean(checkedMapCurr[record.id]));

    setCheckedMap(checkedMapCurr);
    setIsAllChecked(isAllCheckedCurr);
  };

  const saveMultiple = () => {
    const selectedRecords = keys(checkedMap);

    onSaveMultiple(selectedRecords);
    onClose();
  };

  const renderNoResultsMessage = () => {
    return (
      <div className={cssNoResults.noResultsMessage}>
        <div className={cssNoResults.noResultsMessageLabelWrap}>
          <Icon iconRootClass={cssNoResults.noResultsMessageIcon} icon="search" />
          <span className={cssNoResults.noResultsMessageLabel}><FormattedMessage id="ui-plugin-find-finc-metadata-collection.isEmptyMessage" /></span>
        </div>
      </div>
    );
  };

  const footer = (
    <PaneFooter footerClass={css.paneFooter}>
      <div className={css.pluginModalFooter}>
        <Button
          className="left"
          data-test-find-collection-modal-close
          marginBottom0
          onClick={onClose}
        >
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.close" />
        </Button>
        <div>
          <FormattedMessage
            id="ui-plugin-find-finc-metadata-collection.modal.totalSelected"
            values={{ count: checkedRecordsLength }}
          />
        </div>
        <Button
          buttonStyle="primary"
          data-test-find-collection-modal-save
          disabled={!isEditable}
          marginBottom0
          onClick={saveMultiple}
        >
          <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.save" />
        </Button>
      </div>
    </PaneFooter>
  );

  const columnMapping = {
    isChecked: (
      <Checkbox
        checked={isAllChecked}
        data-test-find-records-modal-select-all
        onChange={isEditable ? toggleAll : undefined}
        type="checkbox"
      />
    ),
    label: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.label" />,
    mdSource: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.mdSource" />,
    permitted: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.permitted" />,
    freeContent: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.freeContent" />,
  };

  const formatter = {
    isChecked: record => (
      <Checkbox
        checked={Boolean(checkedMap[record.id])}
        onChange={isEditable ? () => toggleRecord(record) : undefined}
        type="checkbox"
      />
    ),
    label: col => col.label,
    mdSource: col => get(col, 'mdSource.name', <NoValue />),
    permitted: col => upperFirst(col.permitted),
    selected: col => col.selected,
    freeContent: col => upperFirst(col.freeContent),
  };

  return (
    <div data-test-collections ref={contentRef}>
      <SearchAndSortQuery
        initialFilterState={{ permitted: ['yes'], selected: ['yes'] }}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'label' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
        syncToLocationSearch={false}
      >
        {
          ({
            activeFilters,
            filterChanged,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            resetAll,
            searchChanged,
            searchValue,
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged);

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    id="plugin-find-collection-filter-pane"
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton
                          onClick={toggleFilterPane}
                        />
                      </PaneMenu>
                    }
                    paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div className={css.searchGroupWrap}>
                        <SearchField
                          autoFocus
                          id="collectionSearchField"
                          inputRef={searchField}
                          name="query"
                          onChange={(e) => {
                            if (e.target.value) {
                              getSearchHandlers().query(e);
                            } else {
                              getSearchHandlers().reset();
                            }
                          }}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={
                            !searchValue.query || searchValue.query === ''
                          }
                          fullWidth
                          id="collectionSubmitSearch"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={disableReset()}
                        id="clickable-reset-all"
                        onClick={resetAll}
                      >
                        <Icon icon="times-circle-solid">
                          <FormattedMessage id="stripes-smart-components.resetAll" />
                        </Icon>
                      </Button>
                      <CollectionFilters
                        activeFilters={activeFilters.state}
                        filterData={filterData}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  defaultWidth="fill"
                  firstMenu={renderResultsFirstMenu(activeFilters)}
                  footer={footer}
                  padContent={false}
                  paneTitle={<FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.paneTitle" />}
                  paneSub={renderResultsPaneSubtitle(filtered)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={filtered}
                    formatter={formatter}
                    id="list-collections"
                    isEmptyMessage={renderNoResultsMessage()}
                    onHeaderClick={isEditable ? onSort : undefined}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={undefined}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={filtered ? filtered.length : 0}
                    virtualize
                    visibleColumns={visibleColumns}
                  />
                </Pane>
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

CollectionsView.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  contentData: PropTypes.object,
  contentRef: PropTypes.object,
  filterData: PropTypes.shape({
    mdSources: PropTypes.arrayOf(PropTypes.object),
  }),
  filtered: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func,
  onSaveMultiple: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
};

export default CollectionsView;
