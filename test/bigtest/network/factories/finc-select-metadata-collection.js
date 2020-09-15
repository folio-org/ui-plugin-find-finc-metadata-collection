import faker from 'faker';

import Factory from './application';

export default Factory.extend({
  id: () => faker.random.uuid(),
  label: (i) => 'COLLECTION ' + i,
  description: (i) => 'description' + i,
  mdSource: {
    id: 1,
    name: 'mdSource name'
  },
  metadataAvailable: '',
  usageRestricted: '',
  permittedFor: [],
  freeContent: '',
  lod: {
    publication: '',
    note: ''
  },
  collectionId: '',
  tickets: [],
  contentFiles: [],
  solrMegaCollections: ['21st Century Political Science'],
  selectedBy: [],
});
