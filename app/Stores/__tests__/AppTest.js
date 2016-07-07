import sinon from 'sinon';
import mobx from 'mobx';
import PromisesResolver from "admin-config/tests/mock/PromisesResolver";
import buildPromise from "admin-config/tests/mock/mixins";
import Entity from 'admin-config/lib/Entity/Entity';
import ListView from 'admin-config/lib/View/ListView';
import ShowView from 'admin-config/lib/View/ShowView';
import EditView from 'admin-config/lib/View/EditView';

import EntryRequester from '../../Services/EntryRequester';
import EntityStore from '../EntityStore';

describe('MobxApp', () => {
  let restWrapper = {};
  let changes = {};
  let application = {},
      requester,
      entityStore,
      rawCats,
      rawHumans,
      catEntity,
      humanEntity,
      catView,
      humanView;

  beforeEach(() => {
      application = {
          getRouteFor: (entity, generatedUrl, viewType, id) => {
              let url = 'http://localhost/' + encodeURIComponent(entity.name());
              if (id) {
                  url += '/' + encodeURIComponent(id);
              }

              return url;
          }
      };

      requester = new EntryRequester(application, restWrapper);
      entityStore = new EntityStore(requester);
      catEntity = new Entity('cat');
      changes = {
        'loading': [],
        'totalItems': [],
        'dataStore': []
      }

      // setup state change handlers
      mobx.autorun(() => {
        changes.loading.push(entityStore.loading);
      });
      mobx.autorun(() => {
        changes.totalItems.push(entityStore.totalItems);
      });
      mobx.autorun(() => {
        changes.dataStore.push(entityStore.dataStore);
      });

      rawCats = [
          {"id": 1, "human_id": 1, "name": "Mizoute", "summary": "A Cat"},
          {"id": 2, "human_id": 1, "name": "Suna", "summary": "A little Cat"}
      ];

      rawHumans = [
          {"id": 1, "firstName": "Daph"},
          {"id": 2, "firstName": "Manu"},
          {"id": 3, "firstName": "Daniel"}
      ];
  });

  describe("loadListData", () => {

    it('should return the entity list.', (done) => {

      catView = new ListView('allCats');
      catView.setEntity(catEntity);

      restWrapper.getList = sinon.stub().returns(buildPromise({
        data: rawCats,
        totalCount: rawCats.length
      }));

      entityStore.loadListData(catView).then(() => {
        expect(changes.dataStore.length).toEqual(2);  // changed only once!
        expect(entityStore.totalItems).toEqual(rawCats.length);
        const entries = entityStore.dataStore.getEntries(catView.entity.uniqueId);
        expect(entries[0].values).toEqual(rawCats[0]);
        expect(entries[1].values).toEqual(rawCats[1]);
        expect(restWrapper.getList.callCount).toEqual(1);
        expect(changes.loading.length).toEqual(3);
        expect(changes.loading).toEqual([false, true, false]);
        done();
      });
    });

  });

  describe("load data", () => {

    it('should return the entity with all fields.', (done) => {

      const theCat = rawCats[0];
      catView = new ShowView('showCat');
      catView.setEntity(catEntity);

      restWrapper.getOne = sinon.stub().returns(buildPromise(theCat));

      entityStore.loadShowData(catView, theCat.id).then(() => {
        expect(changes.dataStore.length).toEqual(2);  // changed only once!
        const entry = entityStore.dataStore.getFirstEntry(catView.entity.uniqueId);
        expect(entry.values).toEqual(theCat);
        expect(changes.loading.length).toEqual(3);
        expect(changes.loading).toEqual([false, true, false]);
        expect(restWrapper.getList.callCount).toEqual(1);
        done();
      });
    });

    it('should return the entity with all fields and init edit values', (done) => {

      const theCat = rawCats[0];
      catView = new EditView('editCat');
      catView.setEntity(catEntity);

      restWrapper.getOne = sinon.stub().returns(buildPromise(theCat));

      entityStore.loadEditData(catView, theCat.id).then(() => {
        expect(changes.dataStore.length).toEqual(2);  // changed only once!
        const entry = entityStore.dataStore.getFirstEntry(catView.entity.uniqueId);
        expect(entry.values).toEqual(theCat);
        expect(changes.loading.length).toEqual(3);
        expect(changes.loading).toEqual([false, true, false]);
        expect(restWrapper.getList.callCount).toEqual(1);
        // values init
        expect(entityStore.values).toEqual(entry.values);
        done();
      });
    });

    it('should return the entity with all fields for delete', (done) => {

      const theCat = rawCats[0];

      restWrapper.getOne = sinon.stub().returns(buildPromise(theCat));

      entityStore.loadDeleteData(catView, theCat.id).then(() => {
        expect(changes.dataStore.length).toEqual(2);  // changed only once!
        const entry = entityStore.dataStore.getFirstEntry(catView.entity.uniqueId);
        expect(entry.values).toEqual(theCat);
        expect(changes.loading.length).toEqual(3);
        expect(changes.loading).toEqual([false, true, false]);
        expect(restWrapper.getList.callCount).toEqual(1);
        done();
      });
    });

  });



});
