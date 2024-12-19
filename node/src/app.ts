import express, { Request, Response } from "express";
import { JOIN_DIGITALOCEAN, JOIN_ONLYCOINERS } from "./settings";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  res.send(JOIN_ONLYCOINERS);
});

app.get("/onlycoiners", async (req: Request, res: Response) => {
  res.send(JOIN_ONLYCOINERS);
});

app.get("/digitalocean", async (req: Request, res: Response) => {
  res.send(JOIN_DIGITALOCEAN);
});

export default app;
