import { expect, test } from '@playwright/test';
import { openProofModal, VALID_WALLET } from './helpers';

test.describe('wallet validation', () => {
  test('requires a valid Stellar G-address before proof generation', async ({ page }) => {
    const dialog = await openProofModal(page);
    const wallet = dialog.getByLabel('Stellar wallet address');
    const submit = dialog.getByRole('button', { name: 'Generate proof' });

    await expect(submit).toBeDisabled();
    await expect(dialog.getByText('A valid Stellar wallet is required.')).toBeVisible();

    await wallet.fill(`G${'A'.repeat(55)}`);
    await expect(dialog.getByText('Enter a valid Stellar G-address with a valid checksum.')).toBeVisible();
    await expect(submit).toBeDisabled();

    await wallet.fill(VALID_WALLET);
    await expect(dialog.getByText('Complete Date of birth.')).toBeVisible();

    await dialog.getByLabel('Date of birth').fill('2000-01-01');
    await expect(submit).toBeEnabled();
  });
});
