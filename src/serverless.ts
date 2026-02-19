import serverlessExpress from "@vendia/serverless-express";
import app from "./app";
import { connectDB } from "./config/database/mongo.serverless";

let cachedServer: any;

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectDB();

  if (!cachedServer) {
    cachedServer = serverlessExpress({ app });
  }

  return cachedServer(event, context);
};
