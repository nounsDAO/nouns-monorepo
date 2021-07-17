import { useState } from 'react';
import { openSeaFactory } from '../../wrappers/opensea';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const OpenSeaCollection = (props: { id: number }) => {
  const [asset, setAsset] = useState<any>(undefined);
  const openSeaWrapper = openSeaFactory();
  openSeaWrapper.fetchAsset(props.id).then(res => setAsset(res.data));
  return (
    <div>
      OpenSea Item:
      {asset ? (
        <Card style={{ width: '18rem' }}>
          <Card.Img variant="top" src={asset.image_url} />
          <Card.Body>
            <Card.Title>Noun {asset.token_id}</Card.Title>
            <Card.Text>{asset.description}</Card.Text>
            <a href={asset.permalink}>
              <Button variant="primary">View on OpenSea</Button>
            </a>
          </Card.Body>
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default OpenSeaCollection;
