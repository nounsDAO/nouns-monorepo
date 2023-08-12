import React, { useEffect, useState } from 'react';
import classes from './RepPage.module.css';
import Section from '../../layout/Section';
import { Col, Row, Card } from 'react-bootstrap';
import { Trans } from '@lingui/macro';
import { useAppSelector } from '../../hooks';
import { RepTokens, useRepCall } from '../../wrappers/repTokens';
import useFetch from './useFetch';
import useCallJake from './useCallJake';
import { CHAIN_ID } from '../../config';
import { ethers } from 'ethers';
import repTokensABI from "../../wrappers/repTokensAbi";
import axios from 'axios';
import config from '../../config';
import cadentRepDistributorABI from "./CadentRepDistributorABI";
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'
import { useContractCall, useContractFunction } from '@usedapp/core';
import { useCadentCall } from '../../wrappers/atxDaoNFT';
import { CadentRepDistributorABI } from './CadentRepDistributorABI';
import NavBarButton, { NavBarButtonStyle } from '../../components/NavBarButton';
import { read } from 'fs';

declare var window: any;

export interface CadentRepDistributor {
  canClaim: boolean;
}

const RepPage = () => {

  const activeAccount = useAppSelector(state => state.account.activeAccount);

  const [balanceOf0, setBalanceOf0] = useState(-1);
  const [balanceOf1, setBalanceOf1] = useState(-1);
  const [json0Name, setJson0Name] = useState();
  const [json1Name, setJson1Name] = useState('');
  const [json0Description, setJson0Description] = useState('');
  const [json1Description, setJson1Description] = useState('');
  const [json0Image, setJson0Image] = useState('');
  const [json1Image, setJson1Image] = useState('');

  const [canClaim, setCanClaim] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const [amountPerCadence, setAmountPerCadence] = useState();
  
  let rpcProvider;
  let repContractAddress;
  let cadentRepContractAddress;

  if (CHAIN_ID === 1) {
    let url = "https://polygon-mainnet.g.alchemy.com/v2/QlAdcu2qrGohrGeg-D5Wk5jdsLwARS0H";
    repContractAddress = '0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2';
    cadentRepContractAddress = '';
    rpcProvider = new ethers.providers.JsonRpcProvider(url);
  } else {
    rpcProvider = new ethers.providers.JsonRpcProvider();
    repContractAddress = config.addresses.repTokensAddress;
    cadentRepContractAddress = config.addresses.cadentDistributorAddress;
  }

  const readableRepContract = new ethers.Contract(
    repContractAddress as string,
    repTokensABI,
    rpcProvider
  );

  const walletProvider = new ethers.providers.Web3Provider(window.ethereum)

  const readableCadentRepContract = new ethers.Contract(
    cadentRepContractAddress as string,
    CadentRepDistributorABI,
    walletProvider
  );

  const cadentInterface = new utils.Interface(CadentRepDistributorABI);
  const contract = new Contract(config.addresses.cadentDistributorAddress, cadentInterface) as any;
  const { state, send } = useContractFunction(contract, 'claim', { transactionName: 'Claim' })

  const Claim = async () => {
    await send();
    await getCanClaim(readableCadentRepContract);
    await getBalances(readableRepContract);
  }

  useEffect(()=> {
    if (!activeAccount)
        return;

    if (canClaim === undefined)
      getCanClaim(readableCadentRepContract);

    if (remainingTime === undefined)
      getRemainingTime(readableCadentRepContract);

      if (amountPerCadence === undefined)
        getAmountDistributed(readableCadentRepContract);

    if (balanceOf0 === -1) {
      getBalances(readableRepContract);
    }

    if (json0Name === undefined)
        getJson(readableRepContract);

    const interval = setInterval(() => 
    {
      getCanClaim(readableCadentRepContract);
      getRemainingTime(readableCadentRepContract) 
    }, 12000);
    return () => {
      clearInterval(interval);
    };
  })

  async function getCanClaim(contract: Contract) {
    const result = await contract.canClaim();
    setCanClaim(result);
  }

  async function getRemainingTime(contract: Contract) {
    const result = await contract.getRemainingTime();
    setRemainingTime(result.toNumber());
  }

  async function getAmountDistributed(contract: Contract) {
    const result = await contract.getAmountDistributedPerCadenceCycle();
    setAmountPerCadence(result.toNumber());
  }

  async function getBalances(contract: Contract) {
        const result = await contract.balanceOf(activeAccount, 0);
        setBalanceOf0(result);
        const result2 = await contract.balanceOf(activeAccount, 1);
        setBalanceOf1(result2);
  }

  async function getJson(contract: Contract) {
        const uri0 = await contract.uri(0);
        const uri1 = await contract.uri(1);

        let finalURL0 = uri0.replace("ipfs://", "https://ipfs.io/ipfs/");
        let finalJson0 = await axios.get(finalURL0);
        setJson0Name(finalJson0.data.name);
        setJson0Description(finalJson0.data.description);
        setJson0Image(finalJson0.data.image);

        let finalURL1 = uri1.replace("ipfs://", "https://ipfs.io/ipfs/");
        let finalJson1 = await axios.get(finalURL1);
        setJson1Name(finalJson1.data.name);
        setJson1Description(finalJson1.data.description);
        setJson1Image(finalJson1.data.image);
  }

  let canClaimConditional;
  if (canClaim) {
    canClaimConditional = <><button style={{width:200}} onClick={Claim}>Claim { amountPerCadence } tokens!</button></>
  }else {
    canClaimConditional = <><span> You can redeem more tokens in less than {remainingTime} second(s)!</span></>
  }

  return (
    <Section fullWidth={false} className={classes.section}>
      <Row className={classes.headerRow}>
        
        <span>
          <Trans>Reputation</Trans>
        </span>
        <h1>
          <Trans>ATX REP</Trans>
        </h1>
      </Row>
      <Col sm={12} md={6} className={classes.wrapper}>
        <p>
          An on-chain reputation system for tracking and rewarding contributions. REP consists of an ERC1155 smart contract with two tokens on the Polygon Network. An equal amount of both tokens will be awarded to community members when distributed.
        </p>
        <Row>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>On-Chain Activity</b><br />
            </p>
            <p>
            REP will enable us to reward our most active community members and incentivize engagement with our events, initiatives and projects.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Lasting Recognition</b><br />
            </p>
            <p>
            As we further decentralize, REP will help visualize and track both the contributions that have brought us to where we are now and where the beating heart of the DAO is today.
            </p>
          </Col>
          <Col sm={12} md={6}>
            <p style={{ textAlign: 'center' }}>
            <b>Holistic Admission</b><br />
            </p>
            <p>
            Through REP, non-members can build concretely towards a full membership through their engagement and contributions.
            </p>
          </Col>
        </Row>
      </Col>
      <Col sm={12} md={6}>
      
        <Row>
        </Row>
        <Card className={classes.card}>
        {canClaimConditional}
          <Row>
            <h3 style={{marginBottom:'2rem', marginTop:'1rem'}}>Your REP Tokens</h3>
            <Col sm={12} md={6}>
              <div className={classes.container}>
                {
                  <img src={json1Image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/>
                }
                <div className={classes.overlay}></div>
                <h3 className={classes.centered }>
                  {Number(balanceOf1)}
                  </h3>
              </div>
              <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                {json1Name}
              </h4>
              <p style={{textAlign: 'center'}}>
                {json1Description}
                </p>
            </Col>
            <Col sm={12} md={6}>
              <div className={classes.container}>
                {
                <img src={json0Image.replace("ipfs://", "https://ipfs.io/ipfs/")} width="200px" alt="Lifetime"/>
                }
                <div className={classes.overlay}></div>
                <h3 className={classes.centered }>
                  {Number(balanceOf0)}
                </h3>
              </div>
              <h4 className={classes.center} style={{paddingTop: '2rem'}}>
                {json0Name}
                </h4>
              <p  style={{textAlign: 'center'}}>
                {json0Description}
                </p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Section>
  );
};

export default RepPage;
