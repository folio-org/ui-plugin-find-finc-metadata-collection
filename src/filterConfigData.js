import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.no" />, cql: 'no' }
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.no" />, cql: 'no' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.undetermined" />, cql: 'undetermined' }
    ],
  },
  {
    name: 'permitted',
    cql: 'permitted',
    values: [
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.no" />, cql: 'no' }
    ],
  },
  {
    name: 'assigned',
    cql: 'assigned',
    values: [
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-plugin-find-finc-metadata-collection.filterValue.no" />, cql: 'no' }
    ],
  },
  {
    name: 'mdSource',
    cql: 'mdSource',
    values: [],
  }
];

export default filterConfig;
