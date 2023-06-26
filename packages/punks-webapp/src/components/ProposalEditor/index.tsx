import classes from './ProposalEditor.module.css';
import { InputGroup, FormControl, FormText } from 'react-bootstrap';
import remarkBreaks from 'remark-breaks';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { Trans } from '@lingui/macro';

const ProposalEditor = ({
  title,
  body,
  onTitleInput,
  onBodyInput,
}: {
  title: string;
  body: string;
  onTitleInput: (title: string) => void;
  onBodyInput: (body: string) => void;
}) => {
  const bodyPlaceholder = `## Summary\n\nInsert your summary here\n\n## Methodology\n\nInsert your methodology here\n\n## Conclusion\n\nInsert your conclusion here`;
  const [proposalText, setProposalText] = useState('');

  const onBodyChange = (body: string) => {
    setProposalText(body);
    onBodyInput(body);
  };

  return (
    <div>
      <InputGroup className={`${classes.proposalEditor} d-flex flex-column`}>
        <FormText>
          <Trans>Proposal</Trans>
        </FormText>
        <FormControl
          className={classes.titleInput}
          value={title}
          onChange={e => onTitleInput(e.target.value)}
          placeholder="Proposal Title"
        />
        <hr className={classes.divider} />
        <FormControl
          className={classes.bodyInput}
          value={body}
          onChange={e => onBodyChange(e.target.value)}
          as="textarea"
          placeholder={bodyPlaceholder}
        />
      </InputGroup>
      {proposalText !== '' && (
        <div className={classes.previewArea}>
          <h3>
            <Trans>Preview:</Trans>
          </h3>
          <ReactMarkdown
            className={classes.markdown}
            children={proposalText}
            remarkPlugins={[remarkBreaks]}
          />
        </div>
      )}
    </div>
  );
};
export default ProposalEditor;
