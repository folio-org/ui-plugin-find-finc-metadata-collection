import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Checkbox,
  Icon,
  MultiColumnList,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import CollectionFilters from './CollectionFilters';
import css from './CollectionSearch.css';


const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};

export default class CollectionsView extends React.Component {
  static defaultProps = {
    filterData: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      checkedMap: {},
      isAllChecked: false,
    };
    // checkedMap: { '6dd325f8-b1d5-4568-a0d7-aecf6b8d6123': {}, '9a2427cd-4110-4bd9-b6f9-e3475631bbac': {} },
  }

  componentDidMount() {
    const arrayWithIds = this.props.collectionIds[0].collectionIds;
    // ["9a2427cd-4110-4bd9-b6f9-e3475631bbac"]
    // console.log('collectionIds');
    // console.log(arrayWithIds);

    const myObj = _.mapKeys(arrayWithIds);
    this.setState(
      {
        checkedMap: myObj
      }
    );

    // console.log('this.state.checkedMap');
    // console.log(this.state.checkedMap);
    // {6dd325f8-b1d5-4568-a0d7-aecf6b8d6123: {…}, 9a2427cd-4110-4bd9-b6f9-e3475631bbac: {…}}
  }

  columnWidths = {
    isChecked: 40,
    label: 230,
    mdSource: 230,
    permitted: 100,
    filters: 100,
    freeContent: 100
  };

  getArrayElementsCommaSeparated = (array) => {
    let formatted = '';

    if (array && array.length) {
      for (let i = 0; i < array.length; i += 1) {
        formatted += (i > 0 ? '; ' : '') + array[i];
      }
    }
    return formatted;
  }

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  renderIsEmptyMessage = (query, collection) => {
    if (!collection) {
      return 'no collection yet';
    }

    return (
      <div data-test-collections-no-results-message>
        <NoResultsMessage
          collection={collection}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible ?
      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  visible={filterPaneIsVisible}
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  toggleAll = () => {
    this.setState((state, props) => {
      const isAllChecked = !state.isAllChecked;
      const { contentData } = props;
      const checkedMap = reduceCheckedRecords(contentData, isAllChecked);

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  toggleRecord = toggledRecord => {
    const { id } = toggledRecord;

    this.setState((state, props) => {
      const { contentData } = props;
      const wasChecked = Boolean(state.checkedMap[id]);
      const checkedMap = { ...state.checkedMap };

      if (wasChecked) {
        delete checkedMap[id];
      } else {
        checkedMap[id] = toggledRecord;
      }
      const isAllChecked = contentData.every(record => Boolean(checkedMap[record.id]));

      return {
        checkedMap,
        isAllChecked,
      };
    });
  }

  saveMultiple = () => {
    const { stripes: { okapi }, filterId } = this.props;

    let keys = [];
    keys = _.keys(this.state.checkedMap);

    return fetch(`${okapi.url}/finc-select/filters/${filterId}/collections`, {
      method: 'PUT',
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'collectionIds': keys
      })
    }).then(this.props.onClose);
  }

  isSelected = ({ collection }) => Boolean(this.state.checkedMap[collection.id]);

  render() {
    const { filterData, children, contentRef, contentData, onNeedMoreData, queryGetter, querySetter, collection } = this.props;
    const { checkedMap, isAllChecked } = this.state;
    const count = collection ? collection.totalCount() : 0;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';
    const checkedRecordsLength = this.state.checkedMap ? Object.keys(this.state.checkedMap).length : 0;

    const visibleColumns = ['isChecked', 'label', 'mdSource', 'permitted', 'filters', 'freeContent'];

    // console.log('render this.state.checkedMap');
    // console.log(this.state.checkedMap);

    const footer = (
      <PaneFooter footerClass={css.paneFooter}>
        <div className={css.pluginModalFooter}>
          <Button
            marginBottom0
            onClick={this.props.onClose}
            className="left"
          >
            <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.close" />
          </Button>
          {(
            <React.Fragment>
              <div>
                <FormattedMessage
                  id="ui-plugin-find-finc-metadata-collection.modal.totalSelected"
                  values={{ count: checkedRecordsLength }}
                />
              </div>
              <Button
                buttonStyle="primary"
                data-test-find-records-modal-save
                disabled={!this.props.isEditable}
                // disabled={!checkedRecordsLength}
                marginBottom0
                onClick={this.saveMultiple}
              >
                <FormattedMessage id="ui-plugin-find-finc-metadata-collection.button.save" />
              </Button>
            </React.Fragment>
          )}
        </div>
      </PaneFooter>
    );

    const columnMapping = {
      isChecked: (
        <Checkbox
          checked={isAllChecked}
          data-test-find-records-modal-select-all
          onChange={this.toggleAll}
          type="checkbox"
        />
      ),
      label: 'Label',
      mdSource: 'MdSource',
      permitted: 'Permitted',
      filters: 'Filters',
      freeContent: 'FreeContent'
    };

    const formatter = {
      isChecked: record => (
        <Checkbox
          type="checkbox"
          checked={Boolean(checkedMap[record.id])}
          onChange={() => this.toggleRecord(record)}
        />
      ),
      label: col => col.label,
      // mdSource: collection => collection.mdSource.name,
      mdSource: col => _.get(col, 'mdSource.name', '-'),
      permitted: col => col.permitted,
      selected: col => col.selected,
      filters: col => this.getArrayElementsCommaSeparated(col.filters),
      freeContent: col => col.freeContent,
    };

    return (
      <div data-test-collections ref={contentRef}>
        <SearchAndSortQuery
          // intial filter not working ?!
          // initialFilterState={{ permitted: ['yes'], selected: ['yes'] }}
          initialFilterState={{}}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={false}
        >
          {
            ({
              searchValue,
              getSearchHandlers,
              onSubmitSearch,
              onSort,
              getFilterHandlers,
              activeFilters,
              filterChanged,
              searchChanged,
              resetAll
            }) => {
              const disableReset = () => (!filterChanged && !searchChanged);

              return (
                <Paneset>
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      onClose={this.toggleFilterPane}
                      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                    >
                      <form onSubmit={onSubmitSearch}>
                        <div className={css.searchGroupWrap}>
                          <SearchField
                            autoFocus
                            id="collectionSearchField"
                            inputRef={this.searchField}
                            name="query"
                            onChange={getSearchHandlers().query}
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
                    defaultWidth="80%"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    padContent={false}
                    paneTitle="Metadata Collections"
                    paneSub={this.renderResultsPaneSubtitle(collection)}
                    footer={footer}
                  >
                    <MultiColumnList
                      autosize
                      // columnMapping={this.columnMapping}
                      columnMapping={columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={contentData}
                      // formatter={this.formatter}
                      formatter={formatter}
                      id="list-collections"
                      isEmptyMessage="no results"
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      // onRowClick={onSelectRow}
                      onRowClick={undefined}
                      sortDirection={
                        sortOrder.startsWith('-') ? 'descending' : 'ascending'
                      }
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={visibleColumns}
                    />
                  </Pane>
                  {children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

CollectionsView.propTypes = Object.freeze({
  filterId: PropTypes.string,
  collectionIds: PropTypes.object,
  isEditable: PropTypes.bool,
  children: PropTypes.object,
  contentRef: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  filterData: PropTypes.shape({
    mdSources: PropTypes.array,
  }),
  onNeedMoreData: PropTypes.func,
  // onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  collection: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func
  }),
  onClose: PropTypes.func.isRequired,
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // visibleColumns: PropTypes.arrayOf(PropTypes.string)
});
