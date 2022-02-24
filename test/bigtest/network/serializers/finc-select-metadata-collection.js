import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.fincSelectMetadataCollections)) {
      return ({
        ...json,
        ...{ totalRecords: json.fincSelectMetadataCollections.length }
      });
    } else {
      return json.fincSelectMetadataCollections;
    }
  }

});
