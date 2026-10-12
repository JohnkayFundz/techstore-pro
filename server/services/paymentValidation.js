export const expectedAmountKobo = (order) =>
  Math.round(Number(order?.totalAmount) * 100);

export const matchesSuccessfulTransaction = (transaction, order) =>
  transaction?.status === "success" &&
  transaction?.currency === "NGN" &&
  Number.isSafeInteger(Number(transaction?.amount)) &&
  Number(transaction.amount) === expectedAmountKobo(order) &&
  transaction?.reference === order?.paystackReference;
