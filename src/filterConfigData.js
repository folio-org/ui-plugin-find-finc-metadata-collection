const filterConfig = [
  {
    name: 'selected',
    cql: 'selected',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' },
      { name: 'Undetermined', cql: 'undetermined' }
    ],
  },
  {
    name: 'permitted',
    cql: 'permitted',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  },
  {
    name: 'assigned',
    cql: 'assigned',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  },
  {
    name: 'mdSource',
    cql: 'mdSource',
    values: [],
  }
];

export default filterConfig;
