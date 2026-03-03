import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import stripesSmartComponentsTranslations
  from '@folio/stripes-smart-components/translations/stripes-smart-components/en';

import translations from '../../../translations/ui-plugin-find-finc-metadata-collection/en';

const translationsProperties = [
  {
    prefix: 'ui-plugin-find-finc-metadata-collection',
    translations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: stripesSmartComponentsTranslations,
  },
];

export default translationsProperties;
