//useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Grab {
    data: any;
    loading: string;
    error: string;
}

function useFetch(url: any) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (url === undefined) {
        console.log("I returned");
        return;
    }

      setLoading('loading...')
      setData(undefined);
      setError('');

      let finalURL = url[0].replace("ipfs://", "https://ipfs.io/ipfs/");
      console.log("starting " + url[0]);

      axios.get(finalURL)
      .then(res => {
          setLoading('loaded!');
          //checking for multiple responses for more flexibility 
          //with the url we send in.
          res.data && setData(res.data);
      })
      .catch(err => {
          setLoading('false')
          setError('An error occurred. Awkward..')
      })
      
  }, [url])

  let c: Grab = {
    data: data,
    loading: loading,
    error: error
  }
  return c.data;
}
export default useFetch;