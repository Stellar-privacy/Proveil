import { Page } from '@playwright/test';

export const VALID_WALLET = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';

export async function openProofModal(page: Page, proofTitle = 'Age Eligibility') {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(proofTitle) }).click();
  return page.getByRole('dialog');
}
