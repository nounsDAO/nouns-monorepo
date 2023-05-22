import classes from './ProposalEditor.module.css';
import { InputGroup, FormControl, FormText } from 'react-bootstrap';
import remarkBreaks from 'remark-breaks';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';

const ProposalEditor = ({
  title,
  body,
  onTitleInput,
  onBodyInput,
  isCandidate = false,
}: {
  title: string;
  body: string;
  onTitleInput: (title: string) => void;
  onBodyInput: (body: string) => void;
  isCandidate?: boolean;
}) => {
  const bodyPlaceholder = `## Summary\n\nInsert your summary here\n\n## Methodology\n\nInsert your methodology here\n\n## Conclusion\n\nInsert your conclusion here`;
  const [proposalText, setProposalText] = useState('');

  const onBodyChange = (body: string) => {
    setProposalText(body);
    onBodyInput(body);
  };

  useEffect(() => {
    setProposalText(body);
  }, [body]);

  return (
    <div>
      <InputGroup className={`${classes.proposalEditor} d-flex flex-column`}>
        <FormText>{isCandidate ? <Trans>Candidate</Trans> : <Trans>Proposal</Trans>}</FormText>
        <FormControl
          className={classes.titleInput}
          value={title}
          onChange={e => onTitleInput(e.target.value)}
          placeholder={isCandidate ? 'Proposal candidate title' : 'Proposal title'}
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
            <Trans>Preview</Trans>
          </h3>
          {title && (
            <>
              <h1 className={classes.propTitle}>{title}</h1>
              <hr />
            </>
          )}
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
