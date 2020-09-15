/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.create('finc-select-metadata-collection');
  server.create('tiny-metadata-source');
}
