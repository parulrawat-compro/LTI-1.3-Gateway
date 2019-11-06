class ResourceLink {
  constructor() {
    this.courseId = '';
    this.title = '';
    this.description = '';
    this.id = '';

    this.deploymentId = '';
  }

  initFromJson(courseId, json) {
    this.courseId = courseId;
    this.title = json.title;
    this.description = json.description;
    this.deploymentId = json.deployment_id;
    this.id = json.resource_link_id;
  }
}

module.exports = ResourceLink;
