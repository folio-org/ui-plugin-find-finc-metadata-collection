import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
    collectionIds: [],
    filterData: {},
    onSaveMultiple: _.noop,
  }

  constructor(props) {
    super(props);

    this.state = {
      checkedMap: {},
      filterPaneIsVisible: true,
      isAllChecked: false,
    };
  }

  componentDidMount() {
    if (this.props.collectionIds.length > 0) {
      const arrayWithIds = this.props.collectionIds[0].collectionIds;
      // ["9a2427cd-4110-4bd9-b6f9-e3475631bbac"]

      const myObj = _.mapKeys(arrayWithIds);
      this.setState(
        {
          checkedMap: myObj,
        }
      );
    }
    // {6dd325f8-b1d5-4568-a0d7-aecf6b8d6123: {…}, 9a2427cd-4110-4bd9-b6f9-e3475631bbac: {…}}
  }

  columnWidths = {
    isChecked: 40,
    label: 270,
    mdSource: 270,
    permitted: 150,
    freeContent: 150
  };

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (collection) => {
    if (collection) {
      const count = collection ? collection.length : 0;
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
    const selectedRecords = _.keys(this.state.checkedMap);

    this.props.onSaveMultiple(selectedRecords);
    this.props.onClose();
  };

  render() {
    const { filtered, filterData, children, contentRef, onNeedMoreData, queryGetter, querySetter } = this.props;
    const { checkedMap, isAllChecked } = this.state;
    const query = queryGetter() || {};
    const sortOrder = query.sort || '';
    const checkedRecordsLength = this.state.checkedMap ? Object.keys(this.state.checkedMap).length : 0;

    const visibleColumns = ['isChecked', 'label', 'mdSource', 'permitted', 'freeContent'];

    const footer = (
      <PaneFooter footerClass={css.paneFooter}>
        <div className={css.pluginModalFooter}>
          <Button
            className="left"
            data-test-find-collection-modal-close
            marginBottom0
            onClick={this.props.onClose}
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
                data-test-find-collection-modal-save
                disabled={!this.props.isEditable}
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
          onChange={this.props.isEditable ? this.toggleAll : undefined}
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
          onChange={this.props.isEditable ? () => this.toggleRecord(record) : undefined}
          type="checkbox"
        />
      ),
      label: col => col.label,
      mdSource: col => _.get(col, 'mdSource.name', <NoValue />),
      permitted: col => _.upperFirst(col.permitted),
      selected: col => col.selected,
      freeContent: col => _.upperFirst(col.freeContent),
    };

    return (
      <div data-test-collections ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{ permitted: ['yes'], selected: ['yes'] }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
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
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="20%"
                      lastMenu={
                        <PaneMenu>
                          <CollapseFilterPaneButton
                            onClick={this.toggleFilterPane}
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
                    defaultWidth="fill"
                    firstMenu={this.renderResultsFirstMenu(activeFilters)}
                    footer={footer}
                    padContent={false}
                    paneTitle={<FormattedMessage id="ui-plugin-find-finc-metadata-collection.modal.paneTitle" />}
                    paneSub={this.renderResultsPaneSubtitle(filtered)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={columnMapping}
                      columnWidths={this.columnWidths}
                      contentData={filtered}
                      formatter={formatter}
                      id="list-collections"
                      isEmptyMessage="no results"
                      onHeaderClick={this.props.isEditable ? onSort : undefined}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={undefined}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={filtered ? filtered.length : 0}
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
  children: PropTypes.object,
  collectionIds: PropTypes.arrayOf(PropTypes.object),
  contentRef: PropTypes.object,
  filterData: PropTypes.shape({
    mdSources: PropTypes.array,
  }),
  filtered: PropTypes.arrayOf(PropTypes.object),
  isEditable: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onNeedMoreData: PropTypes.func,
  onSaveMultiple: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
});
