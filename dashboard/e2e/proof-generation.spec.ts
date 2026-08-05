import { expect, test } from '@playwright/test';
import { openProofModal, VALID_WALLET } from './helpers';

test('renders proof generation progress and a successful attestation', async ({ page }) => {
  let requestData: unknown;

  await page.route('**/api/prove', async route => {
    requestData = route.request().postDataJSON();
    await new Promise(resolve => setTimeout(resolve, 300));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        proofType: 'age_over_18',
        walletAddress: VALID_WALLET,
        publicSignals: ['1', '1785677453'],
        txHash: '9178fe05666ccfb34a07ecf47ab8361efe32b642d4c80dfc68e77d712018dc7d',
      }),
    });
  });

  const dialog = await openProofModal(page);
  await dialog.getByLabel('Stellar wallet address').fill(VALID_WALLET);
  await dialog.getByLabel('Date of birth').fill('2000-01-01');
  await dialog.getByRole('button', { name: 'Generate proof' }).click();

  const progress = dialog.getByRole('status');
  await expect(progress).toContainText('Constructing proof');
  await expect(progress.locator('.animate-spin')).toBeVisible();
  await expect(dialog.getByText('Attestation recorded')).toBeVisible();
  await expect(dialog.getByText('[0] 1')).toBeVisible();
  await expect(dialog.getByText('9178fe05666ccfb34a07ecf47ab8361efe32b642d4c80dfc68e77d712018dc7d')).toBeVisible();
  expect(requestData).toEqual({
    proofType: 'age_over_18',
    walletAddress: VALID_WALLET,
    data: { birthdate: '946684800' },
  });
});
