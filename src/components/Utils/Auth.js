import cookie from 'react-cookie';

class Auth {

  static authenticateUser(token) {
    cookie.save('token', token, {path: '/'})
  }

  static isUserAuthenticated() {
    return cookie.load('userAccessToken') !== undefined;
  }

  static deauthenticateUser() {
    cookie.remove('userAccessToken', {path: '/'});
  }

  static getToken() {
    return cookie.load('token')
  }

  static getCookieInfo(field) {
    return cookie.load(field)
  }

  static setCookieInfo(field, value) {
    cookie.save(field, value, {path: '/'})
  }
}

export default Auth;
