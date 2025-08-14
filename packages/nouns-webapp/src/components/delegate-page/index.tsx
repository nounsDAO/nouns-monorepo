'use client';

import DelegationModal from '@/components/delegation-modal';
import { getAddressFromQueryParams } from '@/utils/get-address-from-query-params';
import { useLocation, useNavigate } from 'react-router';

const DelegatePage = () => {
  const { search } = useLocation();
  const delegateTo = getAddressFromQueryParams('to', search);

  const navigate = useNavigate();

  if (!delegateTo || delegateTo.length === 0) {
    return (
      <>
        <DelegationModal onDismiss={() => navigate('/vote')} />
      </>
    );
  }

  return (
    <>
      <DelegationModal onDismiss={() => navigate('/vote')} delegateTo={delegateTo} />
    </>
  );
};

export default DelegatePage;
