export default class Settings {
  constructor (keyPrefix) { this.keyPrefix = keyPrefix; }

  get (key, def) {
    var getVal = localStorage.getItem(this.keyPrefix + key);
    if (typeof def !== 'undefined' && getVal === null) {
      this.set(key, def);
      return def;
    }
    return getVal;
  }

  set (key, value) {
    return localStorage.setItem(this.keyPrefix + key, value);
  }

  remove (keys) {
    keys = [].concat(keys);
    return keys.forEach((key) => localStorage.removeItem(this.keyPrefix + key));
  }
}
