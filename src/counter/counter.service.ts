import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { StorageService } from 'src/auth/storage.service';

export let count = 0;

@Injectable()
export class CounterService {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  @Cron('*/3 * * * * *')
  async updateCount() {
    const headers = await this.authService.getHeaders();
    const storage = this.storageService.getStorage();

    const res = await fetch(
      `https://api.boosty.to/v1/blog/stat/${storage.username}/current`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    const data = await res.json();
    count = data.paidCount;
  }
}
