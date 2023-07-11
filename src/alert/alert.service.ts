import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { StorageService } from 'src/storage/storage.service';

class Alert {
  public id: number;
  public name: string;
  public price: number;
  public displayName: string;
  public nick: string;
  public subscribed: boolean;
  public onTime: number;
  public level: {
    id: number;
    name: string;
    currencyPrices: {
      USD: number;
      RUB: number;
    };
  };
}

type Pair = `${Alert['id']} ${Alert['onTime']}`;

class Alerts {
  private alerts: Alert[] = [];
  private lastTime = 0;

  constructor(lastTime?: number) {
    this.lastTime = lastTime || this.lastTime || 0;
  }

  public shift() {
    const item = this.alerts.shift();
    return item;
  }

  private getPair(alert: Alert): Pair {
    return `${alert.id} ${alert.onTime}`;
  }

  private parsePair(pair: Pair): { id: Alert['id']; onTime: Alert['onTime'] } {
    const _ = pair.split(' ');

    return {
      id: +_[0],
      onTime: +_[1],
    };
  }

  public sync(newAlerts: Alert[]) {
    const prevPairs = this.alerts.map(this.getPair);
    const newPairs = newAlerts
      .filter(
        (el) => el.onTime > this.lastTime && el.level.currencyPrices.RUB > 0,
      )
      .map(this.getPair);

    const pairsSet = new Set([...newPairs, ...prevPairs]);

    const pairs = Array.from(pairsSet)
      .map(this.parsePair)
      .sort((a, b) => a.onTime - b.onTime);

    const mergedAlerts = pairs.map(
      (el) =>
        this.alerts.find((e) => e.id === el.id && e.onTime === el.onTime) ||
        newAlerts.find((e) => e.id === el.id && e.onTime === el.onTime),
    );

    this.alerts = mergedAlerts;
    this.setLastTime(Math.max(this.lastTime, ...pairs.map((el) => el.onTime)));

    return this.alerts;
  }

  public setLastTime(t: number) {
    if (!isNaN(t) && isFinite(t)) {
      this.lastTime = t;
    }
  }

  public getLastTime() {
    return this.lastTime;
  }
}

class AlertsSingleton {
  private static alerts: Alerts = new Alerts();

  public static getInstance() {
    AlertsSingleton.alerts = AlertsSingleton.alerts || new Alerts();
    return AlertsSingleton.alerts;
  }
}

@Injectable()
export class AlertService {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private configService: ConfigService,
  ) {
    if (configService.get('FROM_NOW')) {
      this.init();
    }
  }

  async init() {
    const initialSubs = await this.getNewSubs();
    const maxTime = Math.max(0, ...initialSubs.data.map((el) => el.onTime));
    AlertsSingleton.getInstance().setLastTime(maxTime);
  }

  @Cron('*/30 * * * * *')
  async updateAlerts() {
    const instance = AlertsSingleton.getInstance();

    try {
      const { data } = await this.getNewSubs();
      instance.sync(data);
    } catch (e) {
      console.warn(e?.message);
    }
  }

  private async getNewSubs() {
    const storage = this.storageService.getStorage();
    const limit = this.configService.get('ALERT_LIMIT') || 30;

    const res = await axios.get<{ data: Alert[] }>(
      `https://api.boosty.to/v1/blog/${storage.username}/subscribers?sort_by=on_time&limit=${limit}&order=gt`,
      {
        headers: await this.authService.getHeaders(),
        timeout: 10000,
        timeoutErrorMessage: 'tayma4 poymal',
      },
    );

    const data = res.data;

    return data;
  }

  public debugSub() {
    const instance = AlertsSingleton.getInstance();
    instance.sync([
      {
        id: Date.now() + Math.random(),
        displayName: 'Test',
        level: {
          currencyPrices: { RUB: 1984, USD: 322 },
          id: Date.now() + Math.random(),
          name: 'Testoviy',
        },
        name: 'test',
        nick: 'xXx_test_xXx',
        onTime: instance.getLastTime() + 500,
        price: 1984,
        subscribed: true,
      },
    ]);
  }

  public async getSub() {
    return AlertsSingleton.getInstance().shift();
  }
}
