import cron from 'node-cron';
import fetch from 'node-fetch';
import db from '../configs/database';
import log from '../configs/winstonLogger';

export const cronHistory = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const web = await db.websites.findMany({
        take: 50,
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      if (web) {
        let historyData = [];
        for (let index in web) {
          // fetch all websites
          console.log('Fetching ' + web[index].url);
          const response = await fetch(web[index].url);

          if (response.status) {
            historyData.push({
              websiteId: web[index].id,
              message: response.statusText ? response.statusText : '',
              status: response.statusText ? response.statusText : '',
              code: response.status,
            });
          }
        }

        const createMany = await db.history.createMany({
          data: historyData,
          skipDuplicates: true,
        });
      }
    } catch (err) {
      log.error(err);
    }
  });
};

export const testFetch = async () => {
  try {
    const web = await db.websites.findMany({
      take: 50,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });

    if (web) {
      let historyData = [];
      for (let index in web) {
        // fetch all websites
        console.log('Fetching ' + web[index].url);
        const response = await fetch(web[index].url);

        if (response.status) {
          historyData.push({
            websiteId: web[index].id,
            message: response.statusText,
            status: response.statusText,
            code: response.status,
          });
        }
      }
      const createMany = await db.history.createMany({
        data: historyData,
        skipDuplicates: true,
      });
    }
  } catch (err) {
    log.error(err);
  }
};
