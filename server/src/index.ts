import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { createLandingPageInputSchema, updateLandingPageInputSchema } from './schema';
import { createLandingPage } from './handlers/create_landing_page';
import { getLandingPage } from './handlers/get_landing_page';
import { updateLandingPage } from './handlers/update_landing_page';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  createLandingPage: publicProcedure
    .input(createLandingPageInputSchema)
    .mutation(({ input }) => createLandingPage(input)),
  getLandingPage: publicProcedure
    .query(() => getLandingPage()),
  updateLandingPage: publicProcedure
    .input(updateLandingPageInputSchema)
    .mutation(({ input }) => updateLandingPage(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

// Only start server if this file is run directly
if (require.main === module) {
  start();
}