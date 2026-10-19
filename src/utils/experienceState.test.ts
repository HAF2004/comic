import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPERIENCE_STEPS,
  RECIPIENT_INFO,
  COLOR_PALETTE,
  getStepConfig,
  getStepByNumber,
  getNextStepId,
  skipToGiftStep,
  parseInitialStepFromSearch,
  computeExponentialDamp,
  calculateTotalLeadInDurationSeconds,
  validateQrImageFile,
} from './experienceState.ts';

test('recipient information matches specification for Putri Hanan Latifah', () => {
  assert.equal(RECIPIENT_INFO.name, 'Putri Hanan Latifah');
  assert.equal(RECIPIENT_INFO.birthday, '22 November 2003');
  assert.equal(COLOR_PALETTE.background, '#F8F3EE');
  assert.equal(COLOR_PALETTE.primary, '#C77B87');
});

test('5-step sequence transitions in order and reaches final_state in 15s total duration', () => {
  assert.equal(EXPERIENCE_STEPS.length, 5);
  assert.equal(getNextStepId('envelope'), 'birthday_reveal');
  assert.equal(getNextStepId('birthday_reveal'), 'flower_bloom');
  assert.equal(getNextStepId('flower_bloom'), 'gift_reveal');
  assert.equal(getNextStepId('gift_reveal'), 'final_state');
  assert.equal(getNextStepId('final_state'), 'final_state');

  const totalSeconds = calculateTotalLeadInDurationSeconds();
  assert.equal(totalSeconds, 15);
});

test('skipToGiftStep jumps immediately to final_state without forcing wait', () => {
  assert.equal(skipToGiftStep(), 'final_state');
  const finalCfg = getStepConfig('final_state');
  assert.equal(finalCfg.stepNumber, 5);
  assert.equal(finalCfg.heading, 'Scan to receive your gift.');
});

test('parseInitialStepFromSearch supports autostart=1 and step query parameters', () => {
  assert.equal(parseInitialStepFromSearch(''), 'envelope');
  assert.equal(parseInitialStepFromSearch('?autostart=1'), 'flower_bloom');
  assert.equal(parseInitialStepFromSearch('?step=5'), 'final_state');
  assert.equal(parseInitialStepFromSearch('?step=gift_reveal'), 'gift_reveal');
});

test('computeExponentialDamp smoothly interpolates toward target and is frame-rate independent', () => {
  const halfStep = computeExponentialDamp(0, 10, 6, 0.016);
  assert.ok(halfStep > 0 && halfStep < 10);
  const stationary = computeExponentialDamp(5, 5, 8, 0.016);
  assert.equal(stationary, 5);
});

test('validateQrImageFile validates real QR image uploads and rejects invalid files', () => {
  assert.equal(
    validateQrImageFile({ name: 'qris.png', type: 'image/png', size: 24500 }).valid,
    true,
  );
  assert.equal(
    validateQrImageFile({ name: 'document.pdf', type: 'application/pdf', size: 1200 }).valid,
    false,
  );
  assert.equal(
    validateQrImageFile({ name: 'empty.png', type: 'image/png', size: 0 }).valid,
    false,
  );
});
