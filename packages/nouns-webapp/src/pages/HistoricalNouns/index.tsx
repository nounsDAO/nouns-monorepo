import { useQuery } from '@apollo/client';
import { BigNumber } from 'ethers';
import { Tuple } from 'ramda';
import { useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import { StandaloneNounWithPreloadedSeed } from '../../components/StandaloneNoun';
import { INounSeed } from '../../wrappers/nounToken';
import { allNounQuery } from '../../wrappers/subgraph';
import classes from './HistoricalNouns.module.css';

interface Noun {
  id: string;
  seed: INounSeed;
  traitRarity?: Map<string, Tuple<number, number>>;
}
const LIMIT = 69;

const HistoryPage = () => {
  const { loading, error, data, fetchMore } = useQuery(allNounQuery(), {
    variables: {
      offset: 0,
      limit: LIMIT,
    },
  });

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const shouldShowRarity = process.env.REACT_APP_SHOW_RARITY ?? false;
  const nounContent = (noun: Noun) => (
    <div className={classes.nounWrapper}>
      <StandaloneNounWithPreloadedSeed
        nounId={BigNumber.from(noun.id)}
        shouldLinkToProfile={true}
        seed={noun.seed}
        traitRarity={noun.traitRarity}
      />
    </div>
  );

  const loadMore = async () => {
    setIsLoadingMore(true);
    await fetchMore({
      variables: { offset: nounsWithRarity.length, limit: LIMIT },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        const mergedAuctions = prev.auctions.concat(fetchMoreResult.auctions);
        const newData = {
          ...prev,
          auctions: mergedAuctions,
        };
        return newData;
      },
    });
    setIsLoadingMore(false);
  };

  // assumes you have copmlete view of the nouns
  // doesnt work with pagination after len(nouns) > LIMIT
  // better to handle this in the subgraph probably
  // disabled for this reason 
  const appendRarityToNoun = (nouns: Noun[]) => {
    return nouns.map(noun => {
      const rarity = new Map<string, any>();
      const keys = Object.keys(noun.seed).filter(k => !k.includes('typename'));
      keys.map(key => {
        const duplicates = nouns.filter(
          noun2 => (noun2.seed as any)[key] === (noun.seed as any)[key],
        ).length;
        return rarity.set(key, [duplicates, duplicates / nouns.length]);
      });
      return {
        ...noun,
        traitRarity: rarity,
      } as Noun;
    });
  };

  if (loading) {
    return (
      <Container>
        <Spinner animation="border" />
      </Container>
    );
  } else if (error) {
    return <Container>Failed to load nouns</Container>;
  }
  const nouns = data.auctions.map((a: any) => a.noun);
  const nounsWithRarity = shouldShowRarity ? appendRarityToNoun(nouns) : nouns;
  return (
    <Container>
      <Row className={classes.headerRow}>
        <span>History</span>
        <h1>Historical Nouns</h1>
      </Row>
      <p className={classes.subheading}>
        Meet the collection of nouns that have already been minted!
      </p>
      <Row lg={4} xs={1}>
        {nounsWithRarity.map((noun: Noun) => {
          return <Col>{nounContent(noun)}</Col>;
        })}
        {isLoadingMore ? (
          <Spinner animation='border'/>
        ) : (
          <Button variant="light" onClick={() => loadMore()}>
            Load More
          </Button>
        )}
      </Row>
    </Container>
  );
};

export default HistoryPage;
