import React from 'react';

interface ABIUploadProps {
  abiFileName?: string;
  isInvalid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ABIUpload: React.FC<ABIUploadProps> = ({ abiFileName, isInvalid, onChange }) => {
  const displayLabel = abiFileName === 'etherscan-abi-download.json' ? abiFileName : 'ABI';

  return (
    <div className="mt-4">
      <label htmlFor="import-abi" className="opacity-50">
        {displayLabel}
      </label>
      <input
        className="text-brand-cool-dark-text h-12 w-full rounded-[15px] border border-black/10 px-4 py-2 text-[22px] font-bold"
        type="file"
        id="import-abi"
        accept="application/JSON"
        aria-invalid={isInvalid || undefined}
        onChange={onChange}
      />
    </div>
  );
};

export default ABIUpload;
