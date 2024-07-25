import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';

const CollectionFilters = ({
  activeFilters = {
    selected: [],
    freeContent: [],
    permitted: [],
    mdSource: [],
    assigned: [],
  },
  filterHandlers,
  filterData,
}) => {
  const [filtersState, setFiltersState] = useState({
    selected: [],
    freeContent: [],
    permitted: [],
    mdSource: [],
    assigned: [],
  });

  useEffect(() => {
    const newState = {};
    const arr = [];

    filterConfig.forEach((filter) => {
      const newValues = [];
      let values = {};
      if (filter === 'mdSource') {
        // get filter values from okapi
        values = filterData[filter] || [];
      } else {
        // get filte values from filterConfig
        values = filter.values;
      }

      values.forEach((key) => {
        let newValue = {};
        newValue = {
          value: key.cql,
          label: key.name,
        };
        newValues.push(newValue);
      });

      arr[filter.name] = newValues;

      if (
        filtersState[filter.name] &&
        arr[filter.name].length !== filtersState[filter.name].length
      ) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) {
      setFiltersState(prevState => ({
        ...prevState,
        ...newState
      }));
    }
  }, [filterData, filtersState]);

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-plugin-find-finc-metadata-collection.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filtersState[key]}
          name={key}
          onChange={(group) => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values,
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderMetadataSourceFilter = () => {
    const mdSources = filterData.mdSources;
    const dataOptions = mdSources.map((mdSource) => ({
      value: mdSource.id,
      label: mdSource.label,
    }));

    const mdSourceFilters = activeFilters.mdSource || [];

    return (
      <Accordion
        displayClearButton={mdSourceFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-mdSource"
        label={<FormattedMessage id="ui-plugin-find-finc-metadata-collection.mdSource" />}
        onClearFilter={() => {
          filterHandlers.clearGroup('mdSource');
        }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="mdSource-filter"
          onChange={(value) => filterHandlers.state({
            ...activeFilters,
            mdSource: [value],
          })
          }
          placeholder="Select a Source"
          value={mdSourceFilters[0] || ''}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderMetadataSourceFilter()}
      {renderCheckboxFilter('freeContent')}
      {renderCheckboxFilter('permitted')}
      {renderCheckboxFilter('selected')}
      {renderCheckboxFilter('assigned')}
    </AccordionSet>
  );
};

CollectionFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
  filterData: PropTypes.object,
};

export default CollectionFilters;
