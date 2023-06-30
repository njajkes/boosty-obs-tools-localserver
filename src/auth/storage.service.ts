import { Injectable } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const PATH_TO_TOKEN = path.join(__dirname, '..', '..', 'storage.json');

type Token = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  isEmptyUser: number;
  redirectAppId: string;
};

type Meta = {
  uuid: UUID;
};

interface Storage {
  token?: Token;
  meta: Meta;
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
        meta: {
          uuid: randomUUID(),
        },
      };

      fs.writeFileSync(PATH_TO_TOKEN, JSON.stringify(initial, undefined, 4));

      return initial;
    }
  }

  getUUID() {
    return this.storage.meta.uuid;
  }

  saveToken(token: Token) {
    this.storage.token = token;
    fs.writeFileSync(PATH_TO_TOKEN, JSON.stringify(this.storage, undefined, 4));
    return this.storage.token;
  }

  getToken() {
    return this.storage.token;
  }
}
