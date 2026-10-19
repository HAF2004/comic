import React, { useEffect, useId, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Sparkles, RotateCcw, Heart } from 'lucide-react';
import {
  ExperienceStepId,
  RECIPIENT_INFO,
  validateQrImageFile,
} from '../utils/experienceState';

interface QrGiftCardModalProps {
  currentStep: ExperienceStepId;
  onAdvanceToFinal: () => void;
  onReplayExperience: () => void;
  onBackToBouquet: () => void;
}

export function QrGiftCardModal({
  currentStep,
  onAdvanceToFinal,
  onReplayExperience,
  onBackToBouquet,
}: QrGiftCardModalProps) {
  const fileInputId = useId();
  const [staticQrAvailable, setStaticQrAvailable] = useState<boolean | null>(null);
  const [customQrUrl, setCustomQrUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // Check if /assets/qris.png is supplied without causing a broken image 404
    fetch('/api/asset-status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data && typeof data.qrisExists === 'boolean') {
          setStaticQrAvailable(data.qrisExists);
        } else {
          setStaticQrAvailable(false);
        }
      })
      .catch(() => {
        if (active) setStaticQrAvailable(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (customQrUrl) {
        URL.revokeObjectURL(customQrUrl);
      }
    };
  }, [customQrUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateQrImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid QR image file.');
      return;
    }

    setUploadError(null);
    if (customQrUrl) {
      URL.revokeObjectURL(customQrUrl);
    }
    const nextUrl = URL.createObjectURL(file);
    setCustomQrUrl(nextUrl);
    setCustomFileName(file.name);
    if (currentStep === 'gift_reveal') {
      onAdvanceToFinal();
    }
  };

  const activeQrSrc = customQrUrl ?? (staticQrAvailable ? '/assets/qris.png' : null);
  const isVisible = currentStep === 'gift_reveal' || currentStep === 'final_state';

  if (!isVisible) return null;

  return (
    <section
      aria-label="Birthday Gift QR Reveal"
      className="pointer-events-auto w-full max-w-md mx-auto px-4 transition-all duration-700 ease-in-out"
    >
      <div className="gift-card-surface rounded-2xl p-6 sm:p-7 border border-[#D9B4AA]/60 shadow-[0_18px_48px_rgba(70,58,56,0.12)] text-center">
        {/* Subtle romantic header */}
        <p className="font-script text-2xl sm:text-3xl text-[#C77B87] mb-1">
          {currentStep === 'gift_reveal'
            ? 'A Little Surprise for You'
            : 'Hope You Have a Wonderful Day'}
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#463A38] tracking-tight text-balance inline-flex items-center justify-center gap-1.5">
          {currentStep === 'gift_reveal' ? (
            <>
              <span>A little something for you</span>
              <Heart className="w-4 h-4 text-[#C77B87] shrink-0" aria-hidden="true" />
            </>
          ) : (
            <span>Scan to receive your gift.</span>
          )}
        </h2>

        <p className="mt-1 text-xs text-[#A99A91]">
          For {RECIPIENT_INFO.name} · {RECIPIENT_INFO.formattedBirthday}
        </p>

        {/* QR Code Frame — Never fabricates or alters a QR code */}
        <div className="mt-5 mx-auto max-w-[260px] sm:max-w-[280px] bg-[#FFFDF9] p-4 rounded-xl border border-[#D9B4AA]/70 shadow-inner">
          {activeQrSrc ? (
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square bg-white p-2 rounded-lg border border-[#F8F3EE] flex items-center justify-center overflow-hidden">
                <img
                  src={activeQrSrc}
                  alt={`Payment QR code gift for ${RECIPIENT_INFO.name}`}
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (!customQrUrl) setStaticQrAvailable(false);
                  }}
                  className="w-full h-full object-contain select-none qr-sharp-image"
                />
              </div>
              <span className="mt-2.5 inline-flex items-center gap-1 text-xs text-[#463A38] font-medium">
                <span>Scan this</span>
                <Heart className="w-3.5 h-3.5 text-[#C77B87]" aria-hidden="true" />
              </span>
              {customFileName && (
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#8C6268]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C77B87]" />
                  Loaded: {customFileName}
                </span>
              )}
            </div>
          ) : (
            <div
              data-testid="qr-missing-placeholder"
              className="w-full aspect-square rounded-lg border-2 border-dashed border-[#D9B4AA] bg-[#F8F3EE]/70 p-4 flex flex-col items-center justify-center text-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#D9B4AA]/60 flex items-center justify-center text-[#C77B87] mb-2.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="font-serif text-base font-medium text-[#463A38]">
                Payment QR Placeholder
              </p>
              <p className="mt-1 text-xs text-[#A99A91] leading-relaxed">
                Place your actual QRIS image at{' '}
                <code className="text-[#463A38] font-mono text-[11px]">
                  /assets/qris.png
                </code>{' '}
                or load it below to test scanning.
              </p>

              <label
                htmlFor={fileInputId}
                className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C77B87] hover:bg-[#b56975] text-[#FFFDF9] text-xs font-medium cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#C77B87] focus-within:ring-offset-2 whitespace-nowrap shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Load Actual QR Image</span>
                <input
                  id={fileInputId}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
          )}
        </div>

        {/* Optional error feedback when validating an uploaded QR file */}
        {uploadError && (
          <div
            role="alert"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#9E3B4B]"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Secondary actions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {activeQrSrc && (
            <label
              htmlFor={`${fileInputId}-replace`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D9B4AA] bg-[#FFFDF9] hover:bg-[#F8F3EE] text-[#463A38] text-xs font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-[#C77B87]" />
              <span>Change QR Image</span>
              <input
                id={`${fileInputId}-replace`}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          )}

          <button
            type="button"
            onClick={onBackToBouquet}
            className="px-3.5 py-2 rounded-lg border border-[#D9B4AA]/80 bg-[#FFFDF9] hover:bg-[#F8F3EE] text-[#463A38] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            View Bouquet
          </button>

          <button
            type="button"
            onClick={onReplayExperience}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[#A99A91] hover:text-[#463A38] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>
    </section>
  );
}
