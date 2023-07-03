import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthService } from 'src/auth/auth.service';
import { StorageService } from 'src/storage/storage.service';

class Counter {
  public current: number;
  public target: number | null;

  constructor() {
    this.current = 0;
    this.target = null;
  }
}

export class CounterSingleton {
  private static counter: Counter = new Counter();

  public static getInstance() {
    CounterSingleton.counter = CounterSingleton.counter || new Counter();
    return CounterSingleton.counter;
  }
}

@Injectable()
export class CounterService {
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) {}

  getCounter() {
    return CounterSingleton.getInstance();
  }

  @Cron('*/6 * * * * *')
  async updateCount() {
    const instance = this.getCounter();

    try {
      const fromWidget = await this.subCountFromWidget();
      instance.current = fromWidget.current;
      instance.target = fromWidget.target;
    } catch (e) {
      console.warn(e.message);

      try {
        const fromMetrics = await this.subCountFromAuth();
        instance.current = fromMetrics.current;
        instance.target = null;
      } catch (e) {
        console.warn(e.message);
      }
    }
  }

  async subCountFromWidget() {
    const headers = await this.authService.getHeaders({ ignoreTry: true });
    const storage = this.storageService.getStorage();

    const res = await fetch(
      `https://api.boosty.to/v1/target/${storage.username}/?type=subscribers`,
      {
        method: 'GET',
        headers: headers,
      },
    );

    const data = (await res.json()) as {
      data: {
        finishTime: number | null;
        bloggerUrl: string;
        description: string;
        id: number;
        priority: number;
        type: 'subscribers';
        targetSum: number;
        currentSum: number;
      }[];
    };

    const subGoals = data.data;
    const unsolvedGoal = subGoals.find((el) => el.currentSum !== el.targetSum);

    if (unsolvedGoal) {
      return {
        current: unsolvedGoal.currentSum,
        target: unsolvedGoal.targetSum,
      };
    }

    const solvedGoal = Math.max(...subGoals.map((el) => el.currentSum));
    if (isFinite(solvedGoal)) {
      return {
        current: solvedGoal,
        target: solvedGoal,
      };
    }

    throw new Error('Sub count widget is not found');
  }

  async subCountFromAuth() {
    const headers = await this.authService.getHeaders();
    const storage = this.storageService.getStorage();

    const res = await fetch(
      `https://api.boosty.to/v1/blog/stat/${storage.username}/current`,
      {
        method: 'GET',
        headers: headers,
      },
    );

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Access token is expired');
      }
    }

    const data = await res.json();

    return {
      current: data.paidCount as number,
      target: null,
    };
  }
}
