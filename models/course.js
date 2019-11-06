const ResourceLink = require('./resource-link');

class Course {
  constructor() {
    this.id = '';
    this.label = '';
    this.title = '';

    // array of ResourceLinks
    this.resourceLinks = [];
  }

  initFromJson(json) {
    this.id = json.id;
    this.label = json.label;
    this.title = json.title;
    this.populateCourse(json.resource_links);
  }

  populateCourse(resourceLinksJson) {
    this.resourceLinks = resourceLinksJson.map((resourceLinkJson) => {
      const resourceLink = new ResourceLink();
      resourceLink.initFromJson(this.id, resourceLinkJson);
      return resourceLink;
    });
  }
}

module.exports = Course;
