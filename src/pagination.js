// @flow
import type { SyncConfig } from "./types";

export function getOperationsPageSize(
  accountId: ?string,
  syncConfig: SyncConfig
): number {
  const { paginationConfig } = syncConfig;
  const { operationsPerAccountId, operations } = paginationConfig;
  const numbers = [];
  if (
    operationsPerAccountId &&
    accountId &&
    accountId in operationsPerAccountId
  ) {
    numbers.push(operationsPerAccountId[accountId]);
  }
  if (typeof operations === "number") {
    numbers.push(operations);
  }
  if (numbers.length === 0) return Infinity;
  return Math.max(...numbers);
}
