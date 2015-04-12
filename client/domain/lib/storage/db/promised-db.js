/*jshint strict: false*/

/**
 * @module promisedDB
 */

/**
 * @typedef PDBConfigObject { object }
 */

var
  indexedDB,
  createUpgradeHandler,
  setupObjectStore,
  setupIndex,
  createObjectStoreInDB,
  createIndexOnObjectStore;

// Find the right indexedDB reference
indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

import PDBDatabase from "domain/lib/storage/db/PDBDatabase";

// START CREATION HELPERS

/**
 * @private
 * @description
 *   creates and returns an object store
 *
 * @param indexedDBInstance { IDBDatabase }
 * @param storeName { string }
 * @param optionalParameters { object }
 * @returns { IDBObjectStore }
 */
createObjectStoreInDB = function( indexedDBInstance, storeName, optionalParameters={} ) {
  return indexedDBInstance.createObjectStore( storeName, optionalParameters );
};

//
/**
 * @private
 * @description
 *   creates and returns an index
 *
 * @param objectStore { IDBObjectStore }
 * @param indexName { string }
 * @param keyPath { string }
 * @param optionalParameters { object }
 * @returns { IDBIndex }
 */
createIndexOnObjectStore = function( objectStore, indexName, keyPath, optionalParameters={} ) {
  return objectStore.createIndex( indexName, keyPath, optionalParameters );
};

/**
 * @function setupIndex
 * @private
 * @description
 *   Creates a new index, kind redundant with above but helps with optional param defaults
 *
 * @param objectStore
 * @param indexName
 * @param indexConfig
 */
setupIndex = function( objectStore, indexName, indexConfig ) {
  var newIndex = createIndexOnObjectStore( objectStore, indexName, ...indexConfig );

  // todo remove debug
  console.log( `created index ${newIndex.name} on store ${objectStore.name}` );
};

/**
 * @function setupObjectStore
 * @private
 * @description
 *   Iterates over the store configs for a specific version
 *   creating the object stores in the indexedDB database
 *
 * @param idbInstance { IDBDatabase }
 * @param storeName { string }
 * @param storeConfig { PDBConfigObject }
 *
 * @returns {undefined}
 */
setupObjectStore = function( idbInstance, storeName, storeConfig ) {
  var newObjectStore = createObjectStoreInDB( idbInstance, storeName, storeConfig.options );

  console.log( "created store: " + newObjectStore.name );
  Object.keys( storeConfig.indexes || {} ).forEach(function( indexName ) {
    setupIndex( newObjectStore, indexName, storeConfig.indexes[ indexName ] );
  });
};

// END CREATION HELPERS

/**
 * @private
 * @description
 *   Generates a function that is used as the onupgradeneeded event handler
 *    for the given config array and version number
 *
 * @param currentVersion { number }
 * @param configArray { Array<PDBConfigObject> }
 * @returns {Function}
 */
createUpgradeHandler = function( currentVersion, configArray ) {
  return function( upgradeEvent ) {
    // get the indexeddb instance
    var idb = upgradeEvent.target.result;

    // config array index === version number - 1
    configArray.forEach(function( versionConfig, index ) {
      // check version
      if ( idb.version > index + 1 ) {
        // skip this version (it is already set up)
        console.log( "%s skipping version %d", idb.name, index + 1 );
        return;
      }

      // Iterate over store configuration, getting each store name
      Object.keys( versionConfig ).forEach(function( storeName ) {
        setupObjectStore( idb, storeName, versionConfig[ storeName ] );
      });
    });
  };
};

// START MODULE EXPORT

export default {
  /**
   * @function open
   * @description
   *  Set up and creation of IndexedDB database and PromisedDB representation.
   *
   * @param name { string }
   * @param version { number }
   * @param config { PDBConfigObject }
   * @returns { Promise<PDBDataBase> }
   */
  open( name, version, config ) {
    return new Promise(function( resolve, reject ) {
      var openRequest = indexedDB.open( name, version );

      // perform upgrade
      openRequest.onupgradeneeded = createUpgradeHandler( version, config );

      // reject if blocked?
      openRequest.onblocked = function( event ) {
        console.log( `${name} version: ${version} openRequest.onblocked %o`, event );
        reject( event );
      };

      // create and resolve on success
      openRequest.onsuccess = function( event ) {
        console.log( `${name} version: ${version} openRequest.onsuccess %o`, event );
        resolve( new PDBDatabase( event.target.result ) );
      };

      // reject on error
      openRequest.onerror = function( event ) {
        console.warn( `${name} version: ${version} openRequest.onerror %o`, event );
        reject( event );
      };
    })
      .catch( error => {
        console.log( "in promisedDB.open new promise catch" );
        console.error( error );
        // TODO?
        return null;
      });
  },
  /**
   * @function deleteDatabase
   * @description deletes a IndexedDB database by name
   *
   * @param name { string } -- the name of the database to delete
   * @returns {undefined}
   */
  deleteDatabase( name ) {
    return indexedDB.deleteDatabase( name );
  }
};
