/*
set localStorage
*/
import store from 'store';
const USER_KEY = 'user_key';

export default {
  // Store current user
  saveUser(user) {store.set(USER_KEY, user)},

  //Get current user if no user get {}
  getUser() {return store.get(USER_KEY) || {}},

  // Remove current user
  removeUser() {store.remove(USER_KEY)}
}