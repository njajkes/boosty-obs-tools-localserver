import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const PATH_TO_TOKEN = path.join(process.cwd(), 'storage.json');
const PATH_TO_TOKEN_EXAMPLE = path.join(process.cwd(), 'storage.example.json');

interface Storage {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  isEmptyUser: number;
  redirectAppId: string;
  uuid: UUID;
  username: string;
}

@Injectable()
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = this.readStorage();
  }

  private readStorage() {
    try {
      const raw = fs.readFileSync(PATH_TO_TOKEN);
      const str = raw.toString();
      const json = JSON.parse(str);

      return json as Storage;
    } catch {
      const initial: Storage = {
        accessToken: '0123456789abcdefghijklmnopqrstuvwxyz',
        refreshToken: '0123456789abcdefghijklmnopqrstuvwxyz',
        expiresAt: 1234567890,
        isEmptyUser: 0,
        redirectAppId: 'web',
        uuid: `1234abcd-56ef-78zx-90er-poiuqwertyui`,
        username: 'username',
      };

      fs.writeFileSync(
        PATH_TO_TOKEN_EXAMPLE,
        JSON.stringify(initial, undefined, 4),
      );

      console.error(`
storage.json file does not exist
I created a file storage.example.json with an example of what I want
you have to go to https://boosty.to in incognito mode browser, then go to the console and run the following code:
(() => {
    const authData = JSON.parse(localStorage.auth)
    console.log(JSON.stringify({
        uuid: localStorage._clientId,
        ...authData,
        expiresAt: +authData.expiresAt,
        isEmptyUser: 0,
        redirectAppId: "web",
        username: "!ENTER_YOUR_USERNAME!",
    }, undefined, 4))
})()
Then you need to create the file storage.json and insert the data into this file 
      `);
      process.exit(1);
    }
  }

  getStorage() {
    return this.storage;
  }

  saveToken(accessToken: string, refreshToken: string, expiresAt: number) {
    this.storage.accessToken = accessToken;
    this.storage.refreshToken = refreshToken;
    this.storage.expiresAt = expiresAt;
    fs.writeFileSync(PATH_TO_TOKEN, JSON.stringify(this.storage, undefined, 4));
  }
}
