import { Trans, useLingui } from '@lingui/react/macro';
import Accordion from 'react-bootstrap/Accordion';

import Link from '@/components/link';
import Section from '@/components/section';
import {
  useReadNounsDescriptorAccessoryCount,
  useReadNounsDescriptorBackgroundCount,
  useReadNounsDescriptorBodyCount,
  useReadNounsDescriptorHeadCount,
  useReadNounsDescriptorGlassesCount,
} from '@/contracts';
import { cn } from '@/lib/utils';

interface DocumentationProps {
  backgroundColor?: string;
}

function NounTraits() {
  const { data: accessoryCount } = useReadNounsDescriptorAccessoryCount();
  const { data: backgroundCount } = useReadNounsDescriptorBackgroundCount();
  const { data: bodyCount } = useReadNounsDescriptorBodyCount();
  const { data: headCount } = useReadNounsDescriptorHeadCount();
  const { data: glassesCount } = useReadNounsDescriptorGlassesCount();

  return (
    <ul>
      <li>
        <Trans>backgrounds ({backgroundCount?.toString()}) </Trans>
      </li>
      <li>
        <Trans>bodies ({bodyCount?.toString()})</Trans>
      </li>
      <li>
        <Trans>accessories ({accessoryCount?.toString()}) </Trans>
      </li>
      <li>
        <Trans>heads ({headCount?.toString()}) </Trans>
      </li>
      <li>
        <Trans>glasses ({glassesCount?.toString()})</Trans>
      </li>
    </ul>
  );
}

const Documentation = (props: DocumentationProps = { backgroundColor: '#FFF' }) => {
  const { t } = useLingui();
  const cryptopunksLink = (
    <Link text={<Trans>CryptoPunks</Trans>} url="https://cryptopunks.app/" leavesPage={true} />
  );
  const playgroundLink = (
    <Link text={<Trans>Playground</Trans>} url="/playground" leavesPage={false} />
  );
  const publicDomainLink = (
    <Link
      text={<Trans>public domain</Trans>}
      url="https://creativecommons.org/publicdomain/zero/1.0/"
      leavesPage={true}
    />
  );
  const compoundGovLink = (
    <Link
      text={<Trans>Compound Governance</Trans>}
      url="https://compound.finance/governance"
      leavesPage={true}
    />
  );
  return (
    <Section
      fullWidth={false}
      className={cn('!py-8 lg:!py-16', '-mb-10 sm:-mb-20')}
      style={{ background: props.backgroundColor }}
    >
      <div className="lg:col-span-10 lg:col-start-2">
        <div className="p-4 text-[1.3rem] lg:p-0">
          <h1 className="font-londrina text-[4rem]">
            <Trans>WTF?</Trans>
          </h1>
          <p className="font-pt m-0 my-12 font-medium leading-7 tracking-[-0.25px]">
            <Trans>
              Nouns are an experimental attempt to improve the formation of on-chain avatar
              communities. While projects such as {cryptopunksLink} have attempted to bootstrap
              digital community and identity, Nouns attempt to bootstrap identity, community,
              governance, and a treasury that can be used by the community.
            </Trans>
          </p>
          <p
            className="font-pt m-0 my-12 font-medium leading-7 tracking-[-0.25px]"
            style={{ paddingBottom: '4rem' }}
          >
            <Trans>
              Learn more below, or start creating Nouns off-chain using the {playgroundLink}.
            </Trans>
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item
            eventKey="0"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Summary</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>
                  <Trans>Nouns artwork is in the {publicDomainLink}.</Trans>
                </li>
                <li>
                  <Trans>One Noun is trustlessly auctioned every 24 hours, forever.</Trans>
                </li>
                <li>
                  <Trans>100% of Noun auction proceeds are trustlessly sent to the treasury.</Trans>
                </li>
                <li>
                  <Trans>Settlement of one auction kicks off the next.</Trans>
                </li>
                <li>
                  <Trans>All Nouns are members of Nouns DAO.</Trans>
                </li>
                <li>
                  <Trans>Nouns DAO uses a fork of {compoundGovLink}.</Trans>
                </li>
                <li>
                  <Trans>One Noun is equal to one vote.</Trans>
                </li>
                <li>
                  <Trans>The treasury is controlled exclusively by Nouns via governance.</Trans>
                </li>
                <li>
                  <Trans>Artwork is generative and stored directly on-chain (not IPFS).</Trans>
                </li>
                <li>
                  <Trans>
                    No explicit rules exist for attribute scarcity; all Nouns are equally rare.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Nounders receive rewards in the form of Nouns (10% of supply for first 5 years).
                  </Trans>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item
            eventKey="1"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Daily Auctions</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p className="m-0">
                <Trans>
                  The Nouns Auction Contract will act as a self-sufficient Noun generation and
                  distribution mechanism, auctioning one Noun every 24 hours, forever. 100% of
                  auction proceeds (ETH) are automatically deposited in the Nouns DAO treasury,
                  where they are governed by Noun owners.
                </Trans>
              </p>
              <p className="m-0">
                <Trans>
                  Each time an auction is settled, the settlement transaction will also cause a new
                  Noun to be minted and a new 24 hour auction to begin.{' '}
                </Trans>
              </p>
              <p>
                <Trans>
                  While settlement is most heavily incentivized for the winning bidder, it can be
                  triggered by anyone, allowing the system to trustlessly auction Nouns as long as
                  Ethereum is operational and there are interested bidders.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="2"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Nouns DAO</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <Trans>
                Nouns DAO utilizes a fork of {compoundGovLink} and is the main governing body of the
                Nouns ecosystem. The Nouns DAO treasury receives 100% of ETH proceeds from daily
                Noun auctions. Each Noun is an irrevocable member of Nouns DAO and entitled to one
                vote in all governance matters. Noun votes are non-transferable (if you sell your
                Noun the vote goes with it) but delegatable, which means you can assign your vote to
                someone else as long as you own your Noun.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="3"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Nouns DUNA</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Nouns DUNA is a legally recognized Decentralized Unincorporated Nonprofit
                  Association established in Wyoming via{' '}
                  <Link text="Proposal 727" url="https://nouns.wtf/vote/727" leavesPage={true} />{' '}
                  designed to provide a robust legal framework that aligns with the decentralized
                  nature of Nouns DAO. This structure allows Nouns DAO to operate with limited
                  liability protection and legal clarity without compromising its decentralized
                  governance ethos.
                </Trans>
              </p>
              <p>
                <Trans>
                  Under Wyoming&apos;s DUNA Act, Nouns DAO can hold assets, enter into contracts,
                  and participate in legal actions in its own name. Governance remains fully
                  decentralized, with decisions controlled exclusively by Noun holders via on-chain
                  voting. This enables Nouns DAO to sustainably fund projects, manage its treasury,
                  and interact confidently within both the digital and physical worlds.
                </Trans>
              </p>
              <p>
                <Trans>
                  By adopting the DUNA model, Nouns DAO sets a pioneering example for DAOs seeking
                  to balance decentralized autonomy with legal certainty, further solidifying its
                  position at the forefront of decentralized governance innovation.
                </Trans>
              </p>
              <Link
                text={t`Learn more about the DUNA`}
                url="https://a16zcrypto.com/posts/article/duna-for-daos/"
                leavesPage={true}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="4"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Governance ‘Slow Start’</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The proposal veto right was initially envisioned as a temporary solution to the
                  problem of ‘51% attacks’ on the Nouns DAO treasury. While Nounders initially
                  believed that a healthy distribution of Nouns would be sufficient protection for
                  the DAO, a more complete understanding of the incentives and risks has led to
                  general consensus within the Nounders, the Nouns Foundation, and the wider
                  community that a more robust game-theoretic solution should be implemented before
                  the right is removed.
                </Trans>
              </p>
              <p>
                <Trans>
                  The Nouns community has undertaken a preliminary exploration of proposal veto
                  alternatives (‘rage quit’ etc.), but it is now clear that this is a difficult
                  problem that will require significantly more research, development and testing
                  before a satisfactory solution can be implemented.
                </Trans>
              </p>
              <p>
                <Trans>
                  Consequently, the Nouns Foundation anticipates being the steward of the veto power
                  until Nouns DAO is ready to implement an alternative, and therefore wishes to
                  clarify the conditions under which it would exercise this power.
                </Trans>
              </p>
              <p>
                <Trans>
                  The Nouns Foundation considers the veto an emergency power that should not be
                  exercised in the normal course of business. The Nouns Foundation will veto
                  proposals that introduce non-trivial legal or existential risks to the Nouns DAO
                  or the Nouns Foundation, including (but not necessarily limited to) proposals
                  that:
                </Trans>
              </p>
              <ul>
                <li>
                  <Trans>unequally withdraw the treasury for personal gain</Trans>
                </li>
                <li>
                  <Trans>
                    bribe voters to facilitate withdraws of the treasury for personal gain
                  </Trans>
                </li>
                <li>
                  <Trans>
                    attempt to alter Noun auction cadence for the purpose of maintaining or
                    acquiring a voting majority
                  </Trans>
                </li>
                <li>
                  <Trans>
                    make upgrades to critical smart contracts without undergoing an audit
                  </Trans>
                </li>
              </ul>
              <p>
                <Trans>
                  There are unfortunately no algorithmic solutions for making these determinations
                  in advance (if there were, the veto would not be required), and proposals must be
                  considered on a case by case basis.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="5"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Noun Traits</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Nouns are generated randomly based Ethereum block hashes. There are no
                  &apos;if&apos; statements or other rules governing Noun trait scarcity, which
                  makes all Nouns equally rare. As of this writing, Nouns are made up of:
                </Trans>
              </p>
              <NounTraits />
              <Trans>
                You can experiment with off-chain Noun generation at the {playgroundLink}.
              </Trans>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="6"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>On-Chain Artwork</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  Nouns are stored directly on Ethereum and do not utilize pointers to other
                  networks such as IPFS. This is possible because Noun parts are compressed and
                  stored on-chain using a custom run-length encoding (RLE), which is a form of
                  lossless compression.
                </Trans>
              </p>

              <p>
                <Trans>
                  The compressed parts are efficiently converted into a single base64 encoded SVG
                  image on-chain. To accomplish this, each part is decoded into an intermediate
                  format before being converted into a series of SVG rects using batched, on-chain
                  string concatenation. Once the entire SVG has been generated, it is base64
                  encoded.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="7"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Noun Seeder Contract</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  The Noun Seeder contract is used to determine Noun traits during the minting
                  process. The seeder contract can be replaced to allow for future trait generation
                  algorithm upgrades. Additionally, it can be locked by the Nouns DAO to prevent any
                  future updates. Currently, Noun traits are determined using pseudo-random number
                  generation:
                </Trans>
              </p>
              <code className="mb-2 mt-6 block">
                keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
              </code>
              <p>
                <Trans>
                  Trait generation is not truly random. Traits can be predicted when minting a Noun
                  on the pending block.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item
            eventKey="8"
            className="font-pt mb-10 border-0 bg-transparent text-[1.2rem] font-medium leading-7 tracking-[-0.25px]"
          >
            <Accordion.Header className="[&_button]:font-londrina [&_button:not(.collapsed)]:text-[#212529] [&_button:not(.collapsed)]:!shadow-none [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:py-0 [&_button]:pl-5 [&_button]:text-[2.5rem] [&_button]:leading-normal hover:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!text-[var(--brand-dark-red)] focus:[&_button]:!shadow-none lg:[&_button]:pl-0">
              <Trans>Nounder&apos;s Reward</Trans>
            </Accordion.Header>
            <Accordion.Body>
              <p>
                <Trans>
                  &apos;Nounders&apos; are the group of ten builders that initiated Nouns. Here are
                  the Nounders:
                </Trans>
              </p>
              <ul>
                <li>
                  <Link
                    text="@cryptoseneca"
                    url="https://twitter.com/cryptoseneca"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@gremplin" url="https://twitter.com/gremplin" leavesPage={true} />
                </li>
                <li>
                  <Link text="@punk4156" url="https://twitter.com/punk4156" leavesPage={true} />
                </li>
                <li>
                  <Link text="@eboyarts" url="https://twitter.com/eBoyArts" leavesPage={true} />
                </li>
                <li>
                  <Link text="@punk4464" url="https://twitter.com/punk4464" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@_solimander_"
                    url="https://twitter.com/_solimander_"
                    leavesPage={true}
                  />
                </li>
                <li>
                  <Link text="@dhof" url="https://twitter.com/dhof" leavesPage={true} />
                </li>
                <li>
                  <Link text="@devcarrot" url="https://twitter.com/carrot_init" leavesPage={true} />
                </li>
                <li>
                  <Link text="@TimpersHD" url="https://twitter.com/TimpersHD" leavesPage={true} />
                </li>
                <li>
                  <Link
                    text="@lastpunk9999"
                    url="https://twitter.com/lastpunk9999"
                    leavesPage={true}
                  />
                </li>
              </ul>
              <p>
                <Trans>
                  Because 100% of Noun auction proceeds are sent to Nouns DAO, Nounders have chosen
                  to compensate themselves with Nouns. Every 10th Noun for the first 5 years of the
                  project (Noun ids #0, #10, #20, #30 and so on) will be automatically sent to the
                  Nounder&apos;s multisig to be vested and shared among the founding members of the
                  project.
                </Trans>
              </p>
              <p>
                <Trans>
                  Nounder distributions don&apos;t interfere with the cadence of 24 hour auctions.
                  Nouns are sent directly to the Nounder&apos;s Multisig, and auctions continue on
                  schedule with the next available Noun ID.
                </Trans>
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Section>
  );
};
export default Documentation;
