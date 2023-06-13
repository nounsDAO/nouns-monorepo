import React from 'react'

type Props = {
  type: 'deposit' | 'withdraw';
  createdAt: string;
  owner: string;
  reason: string;
  tokenIds: string[];
  proposalIds: string[];
}


const ForkEvent = (props: Props) => {
  return (
    <div>ForkEvent</div>
  )
}

export default ForkEvent