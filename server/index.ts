import Router from '@koa/router';
import next from 'next';

const port = parseInt(process.env.PORT || '0', 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

import {Game} from 'boardgame.io';
import {Server} from 'boardgame.io/server';
import {TrolleyGame} from '../games/trolley';

app.prepare().then(() => {
  /* To get next.js and the boadgame.io server running together,
    we start the boardgame.io server, then attach next.js's handle
    middleware to the koa router.
    https://nextjs.org/docs/advanced-features/custom-server
    This looks like we lose some features though - but it looks like that's
    if we use app.render, which we don't.
  */
  // eslint-disable-next-line new-cap
  const gameServer = Server({
    games: [TrolleyGame as Game],
  });

  const server = gameServer.app;
  const router: Router = gameServer.router;

  gameServer.run(port, () => {
    router.all(/.*/, async (ctx) => {
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
    });

    server.use(router.routes());

    console.log(`> Ready on http://localhost:${port}`);
  });
});
