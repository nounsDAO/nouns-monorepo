'use client';

import { Trans } from '@lingui/react/macro';

import pfp4156 from '@/assets/nounder-pfps/4156.png';
import pfp9999 from '@/assets/nounder-pfps/9999.png';
import pfpCryptoseneca from '@/assets/nounder-pfps/cryptoseneca.png';
import pfpDevcarrot from '@/assets/nounder-pfps/devcarrot.png';
import pfpDom from '@/assets/nounder-pfps/dom.png';
import pfpGremplin from '@/assets/nounder-pfps/gremplin.png';
import pfpKai from '@/assets/nounder-pfps/kai.png';
import pfpSolimander from '@/assets/nounder-pfps/solimander.png';
import pfpTimpers from '@/assets/nounder-pfps/timpers.png';
import pfpVapeape from '@/assets/nounder-pfps/vapeape.png';

const bios = [
  {
    name: '4156',
    image: pfp4156,
    handle: 'punk4156',
  },
  {
    name: 'cryptoseneca',
    image: pfpCryptoseneca,
    handle: 'cryptoseneca',
  },
  {
    name: 'Kai@eboy',
    image: pfpKai,
    handle: 'eBoyArts',
  },
  {
    name: 'dom',
    image: pfpDom,
    handle: 'dhof',
  },
  {
    name: 'vapeape',
    image: pfpVapeape,
    handle: 'punk4464',
  },
  {
    name: 'gremplin',
    image: pfpGremplin,
    handle: 'gremplin',
  },
  {
    name: 'solimander',
    image: pfpSolimander,
    handle: '_solimander_',
  },
  {
    name: 'devcarrot',
    image: pfpDevcarrot,
    handle: 'carrot_init',
  },
  {
    name: 'timpers',
    image: pfpTimpers,
    handle: 'TimpersHD',
  },
  {
    name: '9999',
    image: pfp9999,
    handle: 'lastpunk9999',
  },
];

const NoundersPage = () => {
  return (
    <div className="[&_a]:text-foreground [&_h1]:font-londrina [&_h2]:font-londrina [&_h3]:font-londrina mx-auto max-w-3xl p-4 [&_a:hover]:text-red-600 [&_img]:w-1/2 [&_img]:rounded-full">
      <h2 className="mb-8">
        <Trans>The Nounders</Trans>
      </h2>
      <h3 className="mb-8">
        <Trans>3.5 artists, 6.5 technologists</Trans>
      </h3>
      <div className="mb-0 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {bios.map((bio, index) => (
          <div key={`bio-${index}`} className="mb-4 text-center">
            <div className="flex flex-col items-center">
              <img
                src={
                  typeof bio.image === 'string'
                    ? (bio.image as string)
                    : (bio.image as { src: string }).src
                }
                alt={bio.name}
                className="mb-2 w-1/2 max-w-20 rounded-full"
              />
              <h4 className="text-base font-medium">
                {bio.handle && (
                  <a
                    href={`https://twitter.com/${bio.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground transition-colors hover:text-red-600"
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mr-1.5 inline w-5 text-gray-400 transition-colors hover:fill-red-600"
                      data-v-6cab4e66=""
                    >
                      <path
                        d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                        data-v-6cab4e66=""
                      ></path>
                    </svg>
                    {bio.name}
                  </a>
                )}

                {!bio.handle && bio.name}
              </h4>
            </div>
          </div>
        ))}
      </div>
      <h3>
        <Trans>Nounders&apos; Reward</Trans>
      </h3>
      <p className="text-justify">
        <Trans>
          All Noun auction proceeds are sent to the Nouns DAO. For this reason, we, the
          project&apos;s founders (‘Nounders’) have chosen to compensate ourselves with Nouns. Every
          10th noun for the first 5 years of the project will be sent to our multisig (5/10), where
          it will be vested and distributed to individual Nounders.
        </Trans>
      </p>
      <p className="text-justify">
        <Trans>
          The Nounders reward is intended as compensation for our pre and post-launch contributions
          to the project, and to help us participate meaningfully in governance as the project
          matures. Since there are 10 Nounders, after 5 years each Nounder could receive up to 1% of
          the Noun supply.
        </Trans>
      </p>
    </div>
  );
};

export default NoundersPage;
