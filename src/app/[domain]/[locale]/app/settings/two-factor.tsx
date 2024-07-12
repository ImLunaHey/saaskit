'use client';

import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { enableTwoFactor } from './action';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useI18n } from '@/locales/client';

export const TwoFactor = () => {
  const [twoFactorUri, setTwoFactorUri] = useState<string | null>(null);
  const t = useI18n();
  return (
    <div>
      <div>{twoFactorUri}</div>
      {twoFactorUri && (
        <div className="p-2">
          <div className="bg-white p-2 size-64">
            <QRCode
              size={128}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={twoFactorUri}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      )}
      <Button
        className="w-full"
        onClick={async () => {
          // Enable two-factor authentication
          const uri = await enableTwoFactor();

          if (uri) {
            setTwoFactorUri(uri);
          }
        }}
      >
        {t('settings.twoFactor.enable')}
      </Button>
      <InputOTPControlled />
    </div>
  );
};

export function InputOTPControlled() {
  const [value, setValue] = useState('');

  return (
    <div className="space-y-2">
      <InputOTP maxLength={6} value={value} onChange={(value) => setValue(value)} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value === '' ? <>Enter your one-time password.</> : <>You entered: {value}</>}
      </div>
    </div>
  );
}
