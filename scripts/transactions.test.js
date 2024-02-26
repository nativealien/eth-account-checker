import { describe, it, expect } from 'vitest';
import { Account, Balance, Transaction } from './transactions.js';

describe('Account', () => {
  it('initializes with default method', () => {
    const account = new Account();
    expect(account.init()).toEqual({ method: 'eth_requestAccounts' });
  });

  it('initializes with overridden method', () => {
    const method = 'custom_method';
    const account = new Account(method);
    expect(account.init()).toEqual({ method });
  });
});

describe('Balance', () => {
  it('initializes with method and params', () => {
    const from = '0xFROM';
    const to = '0xTO';
    const balance = new Balance(from, to);
    expect(balance.init()).toEqual({
      method: 'eth_getBalance',
      params: [from, to]
    });
  });
});

describe('Transaction', () => {
  it('initializes with transaction details', () => {
    const from = '0xFROM';
    const to = '0xTO';
    const amount = 1; // 1 ETH
    const transaction = new Transaction(from, to, amount);
    expect(transaction.init()).toEqual({
      method: 'eth_sendTransaction',
      params: [{
        from,
        to,
        value: (1 * 1e18).toString(16),
        gas: Number(21000).toString(16),
        gasPrice: Number(25000000).toString(16)
      }]
    });
  });
});