const ToolRegistration = require('./tool-registration');
const Course = require('./course');
const User = require('./user');

class Platform {
  constructor() {
    this.id = '';
    this.iss = '';
    this.oidcUrl = '';
    this.oauth2TokenUrl = '';
    this.name = '';

    this.toolRegistrations = [];
    this.courses = [];
    this.users = [];
  }

  initFromJson(json) {
    this.iss = json.iss;
    this.id = json.id;
    this.oidcUrl = json.oidc_url;
    this.oauth2TokenUrl = json.oauth2_token_url;
    this.name = json.name;
    this.initRegistrations(json.registrations);
    // this.initCourses(json.sample_contexts.courses);
    // this.initUsers(json.sample_contexts.users);
  }

  initRegistrations(registrationsJson) {
    this.toolRegistrations = registrationsJson.map((registrationJson) => {
      const toolRegistration = new ToolRegistration();
      toolRegistration.initFromJson(registrationJson);
      return toolRegistration;
    });
  }

  initCourses(coursesJson) {
    this.courses = coursesJson.map((courseJson) => {
      const course = new Course();
      course.initFromJson(courseJson);
      return course;
    });
  }

  initUsers(usersJson) {
    this.users = usersJson.map((userJson) => {
      const user = new User();
      user.initFromJson(userJson);
      return user;
    });
  }

  getRegistrationByClientId(clientId) {
    return this.toolRegistrations.find((registration) => registration.clientId === clientId);
  }

  getUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getCourseById(courseId) {
    return this.courses.find((course) => course.id === courseId);
  }

  getCourseDataByResLinkId(resLinkId) {
    return this.courses.find((course) => course.resourceLinks.find((resourceLink) => resourceLink.id === resLinkId));
  }

  getResourceLinkbyId(resLinkId) {
    const course = this.getCourseDataByResLinkId(resLinkId);
    if (!course) return null;

    return course.resourceLinks.find((resourceLink) => resourceLink.id === resLinkId);
  }

  getAllRegisteredClientIds() {
    return this.toolRegistrations.map((toolRegistration) => toolRegistration.clientId);
  }
  
  getRegistrationbyDeploymentId(deploymentId) {
    return this.toolRegistrations
      .find((toolRegistration) => toolRegistration.deployments
        .find((deployment) => deployment.id === deploymentId));
  }

  getCourseByResLinkId(resLinkId) {
    return this.courses
      .find((course) => course.resourceLinks
        .find((resourceLink) => resourceLink.id === resLinkId));
  }

}

module.exports = Platform;
