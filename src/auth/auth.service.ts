import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private tokenService: StorageService) {}

  async getHeaders(options?: { isForm?: boolean; ignoreTry?: boolean }) {
    if (!options?.ignoreTry) await this.tryRefresh();

    const storage = this.tokenService.getStorage();

    return {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': options?.isForm
        ? 'application/x-www-form-urlencoded'
        : undefined,
      'X-From-Id': storage.uuid,
      'X-App': storage.redirectAppId,
      'X-Referer': '',
      'X-Currency': 'RUB',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      Authorization: storage.accessToken
        ? 'Bearer ' + storage.accessToken
        : undefined,
    };
  }

  async tryRefresh() {
    const storage = this.tokenService.getStorage();

    if (!(Date.now() + 24 * 60 * 60 * 1000 > storage.expiresAt)) {
      return;
    }

    try {
      const body = `device_id=${storage.uuid}&device_os=web&grant_type=refresh_token&refresh_token=${storage.refreshToken}`;
      const cookie = encodeURIComponent(
        `_clientId=${storage.uuid}; auth={"accessToken":"","refreshToken":"${storage.refreshToken}","expiresAt":0}`,
      );
      const tokenRes = await axios.post<{
        access_token: string;
        expires_in: number;
        refresh_token: string;
      }>('https://api.boosty.to/oauth/token/', body, {
        headers: {
          ...(await this.getHeaders({ ignoreTry: true, isForm: true })),
          Authorization: 'Bearer',
          Cookie: cookie,
        },
      });

      this.tokenService.saveToken(
        tokenRes.data.access_token,
        tokenRes.data.refresh_token,
        Date.now() + tokenRes.data.expires_in * 1000,
      );
    } catch (e) {
      console.warn(e?.message);
    }
  }
}
