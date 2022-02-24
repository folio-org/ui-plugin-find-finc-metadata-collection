import ApplicationSerializer from './application';

const { isArray } = Array;

export default ApplicationSerializer.extend({

  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);

    if (isArray(json.tinyMetadataSources)) {
      return ({
        ...json,
        ...{ totalRecords: json.tinyMetadataSources.length }
      });
    } else {
      return json.tinyMetadataSources;
    }
  }

});
