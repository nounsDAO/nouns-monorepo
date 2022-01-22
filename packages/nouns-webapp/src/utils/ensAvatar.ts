import { useEffect, useState } from 'react';
import { useWeb3Context } from '../hooks/useWeb3';

export const useEnsAvatarLookup = (address: string) => {
  const { provider } = useWeb3Context();
  const [ensAvatar, setEnsAvatar] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (address && provider) {
      provider
        .lookupAddress(address)
        .then(name => {
          if (!name) return;
          provider.getResolver(name).then(resolver => {
            if (!resolver) return;
            resolver
              .getText('avatar')
              .then(avatar => {
                if (mounted) {
                  setEnsAvatar(avatar);
                }
              })
              .catch(error => {
                console.log(`error resolving ens avatar: `, error);
              });
          });
        })
        .catch(error => {
          console.log(`error resolving reverse ens lookup: `, error);
        });
    }

    return () => {
      setEnsAvatar('');
      mounted = false;
    };
  }, [address, provider]);

  return ensAvatar;
};
