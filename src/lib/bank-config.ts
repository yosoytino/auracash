export type BankId = "chase" | "wells-fargo" | "bank-of-america";

export type BankConfig = {
  id: BankId;
  name: string;
  accountLabel: string;
  availableBalance: number;
  colors: {
    primary: string;
    primaryMuted: string;
    background: string;
    card: string;
    text: string;
    muted: string;
    actionRing: string;
    actionIcon: string;
    debit: string;
  };
  /** Quick-action label for the AuraCash entry point */
  cashActionLabel: string;
};

export const BANKS: Record<BankId, BankConfig> = {
  chase: {
    id: "chase",
    name: "Chase",
    accountLabel: "TOTAL CHECKING (...6232)",
    availableBalance: 9665.03,
    cashActionLabel: "Schedule Cash",
    colors: {
      primary: "#117ACA",
      primaryMuted: "#E8F4FC",
      background: "#F5F5F5",
      card: "#FFFFFF",
      text: "#1A1A1A",
      muted: "#6B6B6B",
      actionRing: "#D4EBFA",
      actionIcon: "#117ACA",
      debit: "#C41230",
    },
  },
  "wells-fargo": {
    id: "wells-fargo",
    name: "Wells Fargo",
    accountLabel: "EVERYDAY CHECKING (...4891)",
    availableBalance: 9665.03,
    cashActionLabel: "Schedule Cash",
    colors: {
      primary: "#D71E28",
      primaryMuted: "#FCE8EA",
      background: "#F4F4F4",
      card: "#FFFFFF",
      text: "#141414",
      muted: "#6E6E6E",
      actionRing: "#F9D2D5",
      actionIcon: "#D71E28",
      debit: "#D71E28",
    },
  },
  "bank-of-america": {
    id: "bank-of-america",
    name: "Bank of America",
    accountLabel: "ADVANTAGE BANKING (...7710)",
    availableBalance: 9665.03,
    cashActionLabel: "Cash Delivery",
    colors: {
      primary: "#012169",
      primaryMuted: "#E6EAF2",
      background: "#F2F2F2",
      card: "#FFFFFF",
      text: "#111111",
      muted: "#666666",
      actionRing: "#D6DCE8",
      actionIcon: "#012169",
      debit: "#E31837",
    },
  },
};

export const BANK_LIST = Object.values(BANKS);

export function getBank(id: BankId): BankConfig {
  return BANKS[id];
}

export function poweredByLabel(bankName: string): string {
  return `AuraCash Assistant — Powered by ${bankName}`;
}
