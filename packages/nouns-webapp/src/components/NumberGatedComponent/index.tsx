import { IS_MAINNET } from '../../config';

const NumberGatedComponent = (props: any) => {

    console.log(props.children);
    console.log(props.number);

    let output;
    if (props.number > 0) {
        output = <> { props.children } </>
    } else {
      output = <div>
        <p>
        You do not own an NFT...certain sections of the site are limited.
        </p>
        Please check to make sure you connected with the correct wallet and you are connected to 
        {
            IS_MAINNET ? ' Ethereum Mainnet' : ' Localhost'
        }
        !
      </div>
    }

  return (
    <>
      {output}
    </>
  );
};

export default NumberGatedComponent;
