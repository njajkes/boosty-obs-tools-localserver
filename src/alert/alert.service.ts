import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
      .filter((el) => el.onTime > this.lastTime)
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
    this.lastTime = Math.max(this.lastTime, ...pairs.map((el) => el.onTime));

    return this.alerts;
  }
}

class AlertsSingleton {
  private static alerts: Alerts = new Alerts();

  public static getInstance() {
    AlertsSingleton.alerts = AlertsSingleton.alerts || new Alerts();
    return AlertsSingleton.alerts;
  }
}

const LIMIT = 5;

@Injectable()
export class AlertService {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  @Cron('*/6 * * * * *')
  async updateAlerts() {
    const instance = AlertsSingleton.getInstance();

    try {
      const { data } = await this.getNewSubs();
      instance.sync(data);
      console.log(instance);
    } catch (e) {
      console.warn(e?.message);
    }
  }

  private async getNewSubs() {
    const storage = this.storageService.getStorage();

    const res = await fetch(
      `https://api.boosty.to/v1/blog/${storage.username}/subscribers?sort_by=on_time&limit=${LIMIT}&order=gt`,
      {
        headers: await this.authService.getHeaders(),
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to get subs: ${res.status}`);
    }

    const data = (await res.json()) as { data: Alert[] };
    return data;
  }

  public async getSub() {
    return AlertsSingleton.getInstance().shift();
  }
}
