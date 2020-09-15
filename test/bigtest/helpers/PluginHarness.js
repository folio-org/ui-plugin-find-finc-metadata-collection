import React from 'react';
import noop from 'lodash/noop';
import { Pluggable } from '@folio/stripes/core';

class PluginHarness extends React.Component {
  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        type="find-finc-metadata-collection"
        id="clickable-find-collection"
        searchLabel="Look up collection"
        marginTop0
        searchButtonStyle="default"
        dataKey="collection"
        selectUser={noop}
        visibleColumns={['isChecked', 'label', 'mdSource', 'permitted', 'freeContent']}
        {...this.props}
      >
        <span data-test-no-plugin-available>No plugin available!</span>
      </Pluggable>
    );
  }
}

export default PluginHarness;
