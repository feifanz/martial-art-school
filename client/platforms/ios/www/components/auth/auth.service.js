'use strict';

angular.module('app')
.service('Auth', function (API_URL, $q, $http, $state, $ionicHistory) {
  var self = this;

  self.signup = function (spec) {
    var dfd = $q.defer();

    $http.post(API_URL + '/users/requests', {
      username: spec.username,
      email: spec.email,
      password: spec.password,
      role: spec.role
    })
    .success(function (data) {
      dfd.resolve(data);
    })
    .error(function (err) {
      dfd.reject(err);
    });

    return dfd.promise;
  };

  self.login = function (username, password, role) {
    var dfd = $q.defer();

    $http.post(API_URL + '/auth/login', {
      username: username,
      password: password,
      role: role
    })
    .success(function (response) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('maxRole', response.maxRole);
      localStorage.setItem('role', role);
      localStorage.setItem('user', username);
      dfd.resolve();
    })
    .error(function (err) {
      self.logout();
      dfd.reject(err);
    });

    return dfd.promise;
  };

  self.logout = function () {
    localStorage.setItem('token', '');
    localStorage.setItem('maxRole', '');
    localStorage.setItem('role', '');
    localStorage.setItem('user', '');
    $ionicHistory.clearHistory();
    $state.go('signin');
  };

  /**
   * Returns the user's maximum allowed role.
   *
   * @method getMaxRole
   * @return {String}
   */
  self.getMaxRole = function () {
    return localStorage.getItem('maxRole');
  };

  /**
   * Returns the user's current role.
   *
   * @method getRole
   * @return {String}
   */
  self.getRole = function () {
    return localStorage.getItem('role');
  };

  /**
   * If the given role is valid, sets the user's current role to the given role.
   * Otherwise, does nothing.
   *
   * @method setRole
   * @return {String} the role, or false if the given role was invalid
   */
  self.setRole = function (role) {
    var roles = self.getRoles();
    var idx = roles.indexOf(role);
    if (idx === -1) return false;
    localStorage.setItem('role', role);
    return role;
  };

  /**
   * Returns a list of the possible roles a user can have.
   *
   * @method getRoles
   * @return {Array}
   */
  self.getRoles = function () {
    var roles = self.getAllRoles();
    var role = self.getMaxRole();
    var idx = roles.indexOf(role);
    return roles.slice(0, idx + 1);
  };

  self.getAllRoles = function () {
    return ['instructor', 'admin'];
  };

  self.getUser = function () {
    return localStorage.getItem('user');
  };
});
