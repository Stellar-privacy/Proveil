import { expect, test } from '@playwright/test';
import { openProofModal } from './helpers';

const PROOF_TYPES = [
  'Age Eligibility',
  'Accredited Investor',
  'Credit Score',
  'Jurisdiction Check',
  'Source of Funds',
  'Sanctions Check',
];

test.describe('proof cards', () => {
  for (const proofType of PROOF_TYPES) {
    test(`opens the ${proofType} proof module`, async ({ page }) => {
      const dialog = await openProofModal(page, proofType);

      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: proofType })).toBeVisible();

      await dialog.getByRole('button', { name: 'Close proof module' }).click();
      await expect(dialog).toBeHidden();
    });
  }
});
