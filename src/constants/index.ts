import { Percent } from "@sushiswap/sdk";

export const TTL = 60 * 20;
export const ALLOWED_SLIPPAGE = new Percent("50", "10000"); // 0.05%
export const FEE = new Percent("3", "1000"); // 0.3%
export const API_SERVER = process.env.NODE_ENV === "production" ? "https://api.levxdao.org" : "http://localhost:3001";
