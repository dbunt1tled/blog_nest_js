// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ORMService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const dbConfig = {
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    };
    const logConfig = {
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    };
    const initialConfig: any =
      process.env.NODE_ENV === 'production'
        ? { ...dbConfig }
        : { ...dbConfig, ...logConfig };

    super(initialConfig);
  }

  async onModuleInit() {
    await this.$connect();
    if (process.env.NODE_ENV === 'production') return;

    this.$on('query', (e) => {
      console.log(this.processParametersInSQL(e.query, JSON.parse(e.params))+ `: ${e.duration} ms`);
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  processParametersInSQL(sqlQuery, parameters) {
    let index = 0;

    const processParam = (param) => {
      if (Array.isArray(param)) {
        const processedArray = param
          .map((item) => {
            if (typeof item === 'number') return item;
            return `'${item}'`;
          })
          .join(',');
        return `(${processedArray})`;
      } else if (typeof param === 'number') {
        return param;
      } else {
        return `'${param}'`;
      }
    };
    const updatedQuery = sqlQuery.replace(/\?/g, () =>
      processParam(parameters[index++]),
    );

    return updatedQuery;
  }
}
