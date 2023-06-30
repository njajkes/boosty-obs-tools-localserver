import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.service';
import * as FormData from 'form-data';
import axios from 'axios';
import fetch from 'node-fetch';

@Injectable()
export class AuthService {
  constructor(private tokenService: StorageService) {}

  getHeaders() {
    return {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-From-Id': this.tokenService.getUUID(),
      'X-App': 'web',
      'X-Referer': '',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
    };
  }

  async getCode(phone: string) {
    const data = `client_id=${encodeURIComponent(phone)}`;
    console.log(data);
    try {
      const authRes = await fetch(
        'https://api.boosty.to/oauth/phone/authorize',
        {
          headers: this.getHeaders(),
          body: data,
          method: 'POST',
        },
      );
      const authData = await authRes.json();
      return authData;
    } catch (e) {
      console.log(e);
    }
  }

  async getToken(phone: string, sms: string, code: string) {
    const data = new FormData();

    data.append('device_id', this.tokenService.getUUID());
    data.append('device_os', 'web');
    data.append('client_id', phone);
    data.append('sms_code', sms);
    data.append('code', code);

    const tokenRes = await axios.post<{
      access_token: string;
      expires_in: number;
      refresh_token: string;
    }>('https://api.boosty.to/oauth/phone/token', data, {
      headers: this.getHeaders(),
    });

    return this.tokenService.saveToken({
      expiresAt: `${Date.now() + tokenRes.data.expires_in * 1000}`,
      accessToken: tokenRes.data.access_token,
      refreshToken: tokenRes.data.refresh_token,
      isEmptyUser: 0,
      redirectAppId: this.tokenService.getUUID(),
    });
  }
}
