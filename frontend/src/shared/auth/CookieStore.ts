import { StateStore } from "oidc-client-ts";
// import { Logger } from "oidc-client-ts";
/**
 * @public
 */
export class CookieStore implements StateStore {
  private readonly _prefix: string;
  private readonly _isSecure: boolean;
  // private readonly _logger: Logger = new Logger("CoookieStore");
  // private readonly _store: AsyncStorage | Storage;

  public constructor({
    prefix = "oidc.",
    // store = localStorage,
  }: { prefix?: string } = {}) {
    this._prefix = prefix;
    // this._store = store;
    this._isSecure = import.meta.env.PROD;
  }

  public async set(key: string, value: string): Promise<void> {
    key = this._prefix + key;
    document.cookie = `${key}=${value}; path=/; ${this._isSecure ? "secure;" : ""} SameSite=Lax`;
  }

  public async get(key: string): Promise<string | null> {
    key = this._prefix + key;

    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split("=");

      if (cookieKey === key) {
        return cookieValue;
      }
    }

    return null;
  }

  public async remove(key: string): Promise<string | null> {
    key = this._prefix + key;
    const value = await this.get(key);
    if (value !== null) {
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${this._isSecure ? "secure;" : ""} SameSite=Lax`;
    }
    return value;
  }

  public async getAllKeys(): Promise<string[]> {
    const cookies = document.cookie.split("; ");
    const keys: string[] = [];
    for (const cookie of cookies) {
      const [cookieKey] = cookie.split("=");
      if (cookieKey.indexOf(this._prefix) === 0) {
        keys.push(cookieKey.substr(this._prefix.length));
      }
    }
    return keys;
  }
}
