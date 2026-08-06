import { expect, test } from '@playwright/test';
import { VALID_WALLET } from './helpers';

test.describe('on-chain verification', () => {
  test('rejects invalid wallet input without calling the API', async ({ page }) => {
    let requests = 0;
    await page.route('**/api/verify/**', async route => {
      requests += 1;
      await route.abort();
    });

    await page.goto('/#verify');
    await page.getByLabel('Wallet address').fill(`G${'A'.repeat(55)}`);
    await page.getByRole('button', { name: 'Check verification' }).click();

    await expect(page.getByText('Enter a valid Stellar public key', { exact: true })).toBeVisible();
    expect(requests).toBe(0);
  });

  test('queries and renders an active on-chain attestation', async ({ page }) => {
    await page.route('**/api/verify/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 300));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          wallet: VALID_WALLET,
          proofType: 'credit_score_range',
          verified: true,
        }),
      });
    });

    await page.goto('/#verify');
    await page.getByLabel('Wallet address').fill(VALID_WALLET);
    await page.getByLabel('Proof type').selectOption('credit_score_range');
    await page.getByRole('button', { name: 'Check verification' }).click();

    await expect(page.getByRole('button', { name: 'Querying contract' })).toBeVisible();
    await expect(page.getByText('Active attestation')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open Stellar Expert' })).toHaveAttribute(
      'href',
      `https://stellar.expert/explorer/testnet/account/${VALID_WALLET}`,
    );
  });
});
