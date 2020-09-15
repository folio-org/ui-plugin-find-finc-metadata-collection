import React from 'react';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication, { mount } from '../helpers/setup-application';
import FindCollectionInteractor from '../interactors/find-collection';
import PluginHarness from '../helpers/PluginHarness';

const COLLECTION_COUNT = 25;
const TINY_SOURCE_COUNT = 5;

// let closeHandled = false;
// let collectionChosen = false;

describe('UI-plugin-find-collection', function () {
  const findCollection = new FindCollectionInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('tiny-metadata-source', TINY_SOURCE_COUNT);
    await this.server.createList('finc-select-metadata-collection', COLLECTION_COUNT);
  });

  describe('rendering', function () {
    beforeEach(async function () {
      // collectionChosen = false;
      // closeHandled = false;
      await mount(
        <PluginHarness />
        // <PluginHarness
        //   selectCollection={() => { collectionChosen = true; }}
        //   afterClose={() => { closeHandled = true; }}
        // />
      );
    });

    it('renders button', function () {
      expect(
        findCollection.button.isPresent
      ).to.be.true;
    });

    describe('click the button', function () {
      beforeEach(async function () {
        await findCollection.button.click();
      });

      it('opens a modal', function () {
        expect(findCollection.modal.isPresent).to.be.true;
      });
    });
  });
});
