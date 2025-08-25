import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import { 
  createUserInputSchema, 
  updateUserInputSchema,
  createStoreInputSchema,
  getStoresInputSchema,
  updateStoreInputSchema,
  createTemplateInputSchema,
  createContentInputSchema,
  getContentInputSchema,
  updateContentInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUser } from './handlers/get_user';
import { updateUser } from './handlers/update_user';
import { getTemplates } from './handlers/get_templates';
import { createTemplate } from './handlers/create_template';
import { createStore } from './handlers/create_store';
import { getStores } from './handlers/get_stores';
import { getStore } from './handlers/get_store';
import { updateStore } from './handlers/update_store';
import { createContent } from './handlers/create_content';
import { getContent } from './handlers/get_content';
import { updateContent } from './handlers/update_content';
import { deleteContent } from './handlers/delete_content';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUser(input.userId)),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
  
  // Template management routes
  getTemplates: publicProcedure
    .query(() => getTemplates()),
  
  createTemplate: publicProcedure
    .input(createTemplateInputSchema)
    .mutation(({ input }) => createTemplate(input)),
  
  // Store management routes
  createStore: publicProcedure
    .input(createStoreInputSchema)
    .mutation(({ input }) => createStore(input)),
  
  getStores: publicProcedure
    .input(getStoresInputSchema.optional())
    .query(({ input }) => getStores(input)),
  
  getStore: publicProcedure
    .input(z.object({ storeId: z.number() }))
    .query(({ input }) => getStore(input.storeId)),
  
  updateStore: publicProcedure
    .input(updateStoreInputSchema)
    .mutation(({ input }) => updateStore(input)),
  
  // Content management routes (CMS)
  createContent: publicProcedure
    .input(createContentInputSchema)
    .mutation(({ input }) => createContent(input)),
  
  getContent: publicProcedure
    .input(getContentInputSchema)
    .query(({ input }) => getContent(input)),
  
  updateContent: publicProcedure
    .input(updateContentInputSchema)
    .mutation(({ input }) => updateContent(input)),
  
  deleteContent: publicProcedure
    .input(z.object({ contentId: z.number() }))
    .mutation(({ input }) => deleteContent(input.contentId)),
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

start();