/*jshint strict: false */

import EventEmitter from "domain/lib/event/EventEmitter";
import define from "domain/ed/define-properties";
import PDBObjectStore from "domain/lib/storage/PromisedDB/PDBObjectStore";
import PDBTransaction from "domain/lib/storage/PromisedDB/PDBTransaction";

/**
 * @class PDBDatabase
 * @inherits EventEmitter
 * @property name {string}
 * @property version {number}
 * @property objectStoreNames {DOMStringList}
 * @property variable {property key} -- the name of each object store will be saved as a PDBObjectStore
 */
export default class PDBDatabase extends EventEmitter {
  /**
   * @private
   * @constructor PDBDatabase
   * @param idb {IDBDatabase}
   */
  constructor( idb ) {
    super([ "change" ]);

    Object.defineProperties( this, {
      idb: {
        configurable: false,
        enumberable: false,
        writeable: false,
        value: idb
      },
      close: {
        configurable: false,
        enumberable: true,
        writeable: false,
        value: function() {
          return idb.close();
        }
      }
    });

    define.enumReadOnly( this, [ "name", "version" ], idb );
    define.enumReadOnlyDeep( this, [ "objectStoreNames" ], idb );

    Array.from( idb.objectStoreNames ).forEach( storeName => {
      Object.defineProperty( this, storeName, {
        configurable: false,
        enumberable: true,
        writeable: false,
        value: new PDBObjectStore( this, storeName )
      });
    });
  }

  transaction( storeNames, accessMode ) {
    return new PDBTransaction( this.idb.transaction( storeNames, accessMode ) );
  }

  read( storeNames ) {
    return this.transaction( storeNames, "readonly" );
  }

  write( storeNames ) {
    return this.transaction( storeNames, "readwrite" );
  }
}