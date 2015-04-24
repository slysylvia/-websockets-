/*jshint strict: false*/

import define from "domain/ed/define-properties";
import EDModel from "domain/ed/objects/EDModel";

export default class EDProfile extends EDModel {
  static get MODEL_TYPE() {
    return "profile";
  }

  constructor( args ) {
    super( args );

    define.readOnly( this, [
      "userId",
      "artId",
      "contactId",
      "bio",
      "email",
      "zipcode",
      "website",
      "hometown",
      "createdDate",
      "modifiedDate"
    ], args );

    define.readOnlyDeep( this, [ "name", "socialLinks", "badgesEarned" ], args );
  }
}
