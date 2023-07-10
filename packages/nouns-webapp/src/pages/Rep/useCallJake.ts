//useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers, utils, Contract } from 'ethers';
import repTokensABI from '../../wrappers/repTokensAbi';

const abi = new utils.Interface(repTokensABI);

export interface Grab {
    data: any;
    loading: string;
    error: string;
}

function useCallJake(funcName: string, funcArgs: any[]) {
  const [returnedValue, setReturnedValue] = useState();

  useEffect(() => {

    let customHttpProvider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/");

    const contract = new Contract('0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2', abi, customHttpProvider);

    async function test() {
      let val = await contract[funcName](...funcArgs);
      setReturnedValue(val);
    }

    test();

    // const balance = useContractCall({
    //     abi: abi,
    //     address: '0x57AA5fd0914A46b8A426cC33DB842D1BB1aeADa2',
    //     method: funcName,
    //     args: funcArgs
    //   });


    // if (url === undefined) {
    //     console.log("I returned");
    //     return;
    // }

    //   setLoading('loading...')
    //   setData(undefined);
    //   setError('');

    //   let finalURL = url[0].replace("ipfs://", "https://ipfs.io/ipfs/");
    //   console.log("starting " + url[0]);

    //   axios.get(finalURL)
    //   .then(res => {
    //       setLoading('loaded!');
    //       //checking for multiple responses for more flexibility 
    //       //with the url we send in.
    //       res.data && setData(res.data);
    //   })
    //   .catch(err => {
    //       setLoading('false')
    //       setError('An error occurred. Awkward..')
    //   })
      
  }, [funcName, funcArgs])

  return returnedValue;
}
export default useCallJake;