import { IntlProvider } from 'react-intl';

import componentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import stripesCoreTranslations from '@folio/stripes-core/translations/stripes-core/en';
import smartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';

import findFincMetadataCollectionProviderTranslations
  from '../../../translations/ui-plugin-find-finc-metadata-collection/en';

const prefixKeys = (translations, prefix) => {
  return Object.keys(translations).reduce(
    (acc, key) => ({
      ...acc,
      [`${prefix}.${key}`]: translations[key],
    }),
    {}
  );
};

const translations = {
  ...prefixKeys(findFincMetadataCollectionProviderTranslations, 'ui-plugin-find-finc-metadata-collection'),
  ...prefixKeys(componentsTranslations, 'stripes-components'),
  ...prefixKeys(smartComponentsTranslations, 'stripes-smart-components'),
  ...prefixKeys(stripesCoreTranslations, 'stripes-core'),
};

// eslint-disable-next-line react/prop-types
const Intl = ({ children }) => (
  <IntlProvider locale="en" messages={translations}>
    {children}
  </IntlProvider>
);

export default Intl;
