import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const DEPOSIT_ADDRESSES: Record<string, { address: string; network: string; rate: number }> = {
  BTC:  { address: "bc1qspdrp80sz6ukw4dl84gzk54krlqe53nfgu5jp3", network: "Bitcoin",         rate: 65000 },
  ETH:  { address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A",  network: "Ethereum",        rate: 3200  },
  USDT: { address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A",  network: "ERC20",           rate: 1     },
  BNB:  { address: "0xdf723F511EC2a6d5E8CccaDb1454b1582c0E6f6A",  network: "BNB Smart Chain", rate: 600   },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, currency } = await req.json();
  if (!amount || Number(amount) < 10) {
    return NextResponse.json({ error: "Minimum deposit is $10" }, { status: 400 });
  }

  const wallet = DEPOSIT_ADDRESSES[currency];
  if (!wallet) return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });

  const cryptoAmount = (Number(amount) / wallet.rate).toFixed(8);

  return NextResponse.json({
    address: wallet.address,
    network: wallet.network,
    amount: cryptoAmount,
    currency,
    usdAmount: Number(amount),
  });
}
