class User {
  constructor() {
    this.id = '';
    this.name = '';
    this.givenName = '';
    this.familyName = '';
    this.middleName = '';
    this.picture = '';
    this.email = '';
  }

  initFromJson(json) {
    this.id = json.id;
    this.name = json.name;
    this.givenName = json.given_name;
    this.familyName = json.family_name;
    this.middleName = json.middle_name;
    this.picture = json.picture;
    this.email = json.email;
  }
}

module.exports = User;
