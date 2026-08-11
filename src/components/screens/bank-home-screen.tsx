"use client";

import {
  ArrowLeft,
  ArrowLeftRight,
  Banknote,
  ChevronRight,
  CreditCard,
  Info,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { BankQuickAction } from "@/components/bank/bank-quick-action";
import {
  type BankConfig,
  type BankId,
  BANK_LIST,
} from "@/lib/bank-config";
import { formatCurrency } from "@/lib/flow-state";

type BankHomeScreenProps = {
  bank: BankConfig;
  onScheduleCash: () => void;
  onSwitchBank: (bankId: BankId) => void;
};

const SAMPLE_TRANSACTIONS = [
  { merchant: "Whole Foods Market", date: "Aug 9", amount: -47.82, pending: false },
  { merchant: "Direct Deposit — Payroll", date: "Aug 8", amount: 2840.0, pending: false },
  { merchant: "Shell Oil", date: "Aug 8", amount: -52.15, pending: true },
];

export function BankHomeScreen({
  bank,
  onScheduleCash,
  onSwitchBank,
}: BankHomeScreenProps) {
  const { colors } = bank;

  return (
    <div
      className="relative flex min-h-full flex-col pb-24"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <header
        className="flex items-center gap-3 px-4 pb-3 pt-12"
        style={{ backgroundColor: colors.card }}
      >
        <button
          type="button"
          aria-label="Back"
          className="flex h-[54px] w-[54px] items-center justify-center rounded-full"
          style={{ color: colors.primary }}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="font-body flex-1 text-sm font-semibold tracking-wide">
          {bank.accountLabel}
        </h1>
      </header>

      <div className="px-4 pt-4">
        <section
          className="rounded-lg px-5 py-6 shadow-sm"
          style={{ backgroundColor: colors.card }}
          aria-label="Account balance"
        >
          <p
            className="font-body text-sm"
            style={{ color: colors.muted }}
          >
            Available balance
          </p>
          <p
            className="font-body mt-1 text-[2rem] font-normal tracking-tight"
            style={{ color: colors.text }}
          >
            {formatCurrency(bank.availableBalance)}
          </p>

          <div
            className="mt-6 space-y-3 border-t pt-4"
            style={{ borderColor: `${colors.muted}22` }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1" style={{ color: colors.muted }}>
                Available balance
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>{formatCurrency(bank.availableBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1" style={{ color: colors.muted }}>
                Present balance
                <Info className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span>{formatCurrency(bank.availableBalance + 120.5)}</span>
            </div>
          </div>

          <button
            type="button"
            className="font-body mx-auto mt-5 flex min-h-[44px] items-center gap-1 rounded-full border px-5 text-sm font-medium"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Show details
            <ChevronRight className="h-4 w-4 rotate-90" aria-hidden="true" />
          </button>
        </section>

        <nav
          aria-label="Account quick actions"
          className="mt-6 flex justify-between gap-1 px-1"
        >
          <BankQuickAction
            label="Pay"
            icon={<CreditCard className="h-5 w-5" strokeWidth={1.75} />}
            colors={colors}
          />
          <BankQuickAction
            label="Transfer"
            icon={<ArrowLeftRight className="h-5 w-5" strokeWidth={1.75} />}
            colors={colors}
          />
          <BankQuickAction
            label={bank.cashActionLabel}
            icon={<Banknote className="h-5 w-5" strokeWidth={1.75} />}
            onClick={onScheduleCash}
            highlight
            colors={colors}
          />
          <BankQuickAction
            label="More"
            icon={<MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />}
            colors={colors}
          />
        </nav>

        <section
          className="mt-6 rounded-lg shadow-sm"
          style={{ backgroundColor: colors.card }}
        >
          <button
            type="button"
            className="flex min-h-[54px] w-full items-center justify-between px-4 py-4 text-left"
          >
            <div>
              <p className="font-body text-sm font-semibold">Manage account</p>
              <p className="font-body text-xs" style={{ color: colors.muted }}>
                Access tools &amp; services for your account
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0" style={{ color: colors.muted }} />
          </button>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="font-body text-base font-semibold">See all transactions</h2>
            <ChevronRight className="h-5 w-5" style={{ color: colors.muted }} />
          </div>
          <div
            className="divide-y rounded-lg shadow-sm"
            style={{
              backgroundColor: colors.card,
              borderColor: `${colors.muted}22`,
            }}
          >
            {SAMPLE_TRANSACTIONS.map((tx) => (
              <div
                key={tx.merchant}
                className="flex items-start justify-between gap-3 px-4 py-4"
              >
                <div>
                  <p className="font-body text-sm font-medium">{tx.merchant}</p>
                  <p className="font-body text-xs" style={{ color: colors.muted }}>
                    {tx.date}
                    {tx.pending ? " · Pending" : ""}
                  </p>
                </div>
                <p
                  className="font-body shrink-0 text-sm font-medium"
                  style={{
                    color: tx.amount < 0 ? colors.debit : colors.text,
                  }}
                >
                  {tx.amount < 0 ? "−" : ""}
                  {formatCurrency(Math.abs(tx.amount))}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mt-8 rounded-lg border border-dashed p-4"
          style={{ borderColor: `${colors.muted}44` }}
          aria-label="White-label demo bank switcher"
        >
          <p className="font-body mb-3 text-xs font-medium" style={{ color: colors.muted }}>
            Demo — switch banking partner
          </p>
          <div className="flex flex-wrap gap-2">
            {BANK_LIST.map((partner) => (
              <button
                key={partner.id}
                type="button"
                onClick={() => onSwitchBank(partner.id)}
                className="touch-press min-h-[44px] rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor:
                    partner.id === bank.id ? colors.primary : colors.primaryMuted,
                  color: partner.id === bank.id ? "#FFFFFF" : colors.primary,
                }}
              >
                {partner.name}
              </button>
            ))}
          </div>
        </section>
      </div>

      <button
        type="button"
        aria-label="Open chat"
        className="absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ backgroundColor: colors.primary, color: "#FFFFFF" }}
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
