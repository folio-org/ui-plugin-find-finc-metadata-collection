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

let closeHandled = false;

describe('UI-plugin-find-collection', function () {
  const findCollection = new FindCollectionInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('tiny-metadata-source', TINY_SOURCE_COUNT);
    await this.server.createList('finc-select-metadata-collection', COLLECTION_COUNT);
  });

  describe('rendering plugin in view mode', function () {
    beforeEach(async function () {
      closeHandled = false;
      await mount(
        <PluginHarness
          afterClose={() => { closeHandled = true; }}
          isEditable={false}
        />
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

      it('opens modal in view mode', function () {
        expect(findCollection.modal.isPresent).to.be.true;
      });

      it('save button is not enable', function () {
        expect(findCollection.modal.saveButton.isEnabled).to.be.false;
      });

      it('should return a set of results', function () {
        expect(findCollection.modal.instances().length).to.be.equal(COLLECTION_COUNT);
      });

      describe('close modal', function () {
        beforeEach(async function () {
          await findCollection.modal.closeButton.click();
        });

        it('modal should closed', function () {
          expect(closeHandled).to.be.false;
        });
      });
    });
  });

  describe('rendering plugin in edit mode', function () {
    beforeEach(async function () {
      closeHandled = false;
      await mount(
        <PluginHarness
          afterClose={() => { closeHandled = true; }}
          isEditable
        />
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

      it('opens modal in edit mode', function () {
        expect(findCollection.modal.isPresent).to.be.true;
      });

      it('save button is not enable', function () {
        expect(findCollection.modal.saveButton.isEnabled).to.be.false;
      });

      it('mdSource filter should be present', () => {
        expect(findCollection.modal.mdSourceFilter.isPresent).to.be.true;
      });

      it('freeContent filter should be present', () => {
        expect(findCollection.modal.freeContentFilter.isPresent).to.be.true;
      });

      it('permitted filter should be present', () => {
        expect(findCollection.modal.permittedFilter.isPresent).to.be.true;
      });

      it('selected filter should be present', () => {
        expect(findCollection.modal.selectedFilter.isPresent).to.be.true;
      });

      it('assigned filter should be present', () => {
        expect(findCollection.modal.assignedFilter.isPresent).to.be.true;
      });

      it('reset all button should be present', () => {
        expect(findCollection.modal.resetAllBtn.isPresent).to.be.true;
      });

      it('submit button should be present', () => {
        expect(findCollection.modal.submitBtn.isPresent).to.be.true;
      });

      it('close button should be present', () => {
        expect(findCollection.modal.closeButton.isPresent).to.be.true;
      });

      describe('filling in the searchField', function () {
        beforeEach(async function () {
          await findCollection.modal.searchField.fill('t');
        });

        it('activates the search button', function () {
          expect(findCollection.modal.searchButton.isEnabled).to.be.true;
        });

        it('activates the reset button', function () {
          expect(findCollection.modal.resetAllBtn.isEnabled).to.be.true;
        });
      });

      describe('check filter and reset', function () {
        beforeEach(async function () {
          await findCollection.modal.clickFreeContentYesCheckbox();
          await findCollection.modal.clickAssignedYesCheckbox();
          await findCollection.modal.resetAllBtn.click();
        });

        it('should return a set of results', function () {
          expect(findCollection.modal.instances().length).to.be.equal(COLLECTION_COUNT);
        });
      });

      describe('select collections close modal', function () {
        beforeEach(async function () {
          await findCollection.modal.instances(1).check();
          await findCollection.modal.instances(3).check();
          await findCollection.modal.closeButton.click();
        });

        it('modal should closed', function () {
          expect(closeHandled).to.be.false;
        });
      });

      describe('select a collection of results', function () {
        it('should return a set of results', function () {
          expect(findCollection.modal.instances().length).to.be.equal(COLLECTION_COUNT);
        });

        describe('select collections and save', function () {
          beforeEach(async function () {
            await findCollection.modal.instances(1).check();
            await findCollection.modal.instances(3).check();
            await findCollection.modal.saveButton.click();
          });

          it('modal should closed', function () {
            expect(closeHandled).to.be.false;
          });
        });

        describe('select all collections and save', function () {
          beforeEach(async function () {
            await findCollection.modal.selectAll.click();
            await findCollection.modal.saveButton.click();
          });

          it('modal should closed', function () {
            expect(closeHandled).to.be.false;
          });
        });
      });
    });
  });
});
