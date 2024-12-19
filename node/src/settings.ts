import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV; // prod || dev
export const PORT = process.env.PORT || 8888;
export const JOIN_ONLYCOINERS = "Create, Earn and Network with OnlyCoiners! Join us https://www.onlycoiners.com";
export const JOIN_DIGITALOCEAN = "A cloud for your entire journey! Join us https://m.do.co/c/e0d6be6820ed"