import { auctionHouseContractFactory, useAuction } from '../../wrappers/nounsAuction';
import config from '../../config';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ShortAddress from '../ShortAddress';
import moment from 'moment';
import { BigNumber, utils } from 'ethers';
import { useContractFunction } from '@usedapp/core';

const CurrentAuction = () => {
  const auctionHouseContract = auctionHouseContractFactory(config.auctionProxyAddress);
  const { state, send} = useContractFunction(auctionHouseContract as any, 'createBid')

const sendBid = (nounId: BigNumber, bid: string) => {
  console.log(bid)
  send(nounId, { value: utils.parseEther(bid) })
}
  // This will automatically be updated as blocs ocurr
  const auction = useAuction(config.auctionProxyAddress);
  const [bid, setBid] = useState(0);
  useEffect(() => {
    console.log('auction', auction);
  }, [auction]);

  return (
    <div>
      {auction ? (
        <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>Noun {auction.nounId.toString()}</Card.Title>
            <Card.Text>
              <div>
                Bidder: <ShortAddress>{auction.bidder}</ShortAddress>
              </div>
              <div>Amount: {utils.formatEther(auction.amount)} ETH</div>
              <div>Started {moment(Number(auction.startTime.toString()) * 1000).fromNow()}</div>
              <div>Ends {moment(Number(auction.endTime.toString()) * 1000).fromNow()}</div>
            </Card.Text>
            <Form>
              <Form.Group controlId="formBid">
                <Form.Label>Bid</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Bid"
                  onChange={e => setBid(Number(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Enter your bid in Ether, funds will be transferred now
                </Form.Text>
              </Form.Group>

              <Button variant="primary" onClick={() => sendBid(BigNumber.from(auction.nounId), bid.toString())}>
                Bid
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        ''
      )}
    </div>
  );
};

export default CurrentAuction;
