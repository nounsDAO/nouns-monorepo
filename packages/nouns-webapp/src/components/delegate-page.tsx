'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import DelegationModal from '@/components/delegation-modal';
import { getAddressFromQueryParams } from '@/utils/get-address-from-query-params';

const DelegatePage = () => {
  const params = useSearchParams();
  const delegateTo = getAddressFromQueryParams('to', `?${params.toString()}`);

  const router = useRouter();

  if (!delegateTo || delegateTo.length === 0) {
    return (
      <>
        <DelegationModal onDismiss={() => router.push('/vote')} />
      </>
    );
  }

  return (
    <>
      <DelegationModal onDismiss={() => router.push('/vote')} delegateTo={delegateTo} />
    </>
  );
};

export default DelegatePage;
