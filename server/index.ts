import Router from "@koa/router";
import next from "next";

const port = parseInt(process.env.PORT || "0", 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

import {Server} from 'boardgame.io/server';
import {TrolleyGame} from '../games/trolley';

app.prepare().then(() => {
  // TODO: Insert boardgame.io server here, attached to the server Koa object
  const gameServer = Server({
    games: [TrolleyGame]
  });

  const server = gameServer.app;
  const router = new Router()



  /*
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })
  */

  gameServer.run(port, () => {
    router.all(/.*/, async (ctx) => {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
    })

    server.use(router.routes())

    console.log(`> Ready on http://localhost:${port}`)
  })
})
