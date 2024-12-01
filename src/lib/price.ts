import { Connection } from "@solana/web3.js";
import {
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
} from "@pythnetwork/client";

const PYTHNET_CLUSTER_NAME: PythCluster = "pythnet";
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

export async function getPricePyth(symbol: string): Promise<number | null> {
  try {
    const pythClient = new PythHttpClient(connection, pythPublicKey);
    const pythData = await pythClient.getData();

    const priceData = pythData.productPrice.get(
      `Crypto.${symbol.replace("$", "").toUpperCase()}/USD`,
    );

    return priceData?.price || null;
  } catch (error) {
    console.error("Error fetching price from Pyth:", error);
    return null;
  }
}
