import { useEffect, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { FormControl, FormText, InputGroup } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

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
      <InputGroup
        className={
          'd-flex flex-column border-brand-border-muted my-4 rounded-lg border px-4 pb-4 pt-2 shadow-none outline-none'
        }
      >
        <FormText>{isCandidate ? <Trans>Candidate</Trans> : <Trans>Proposal</Trans>}</FormText>
        <FormControl
          className={'w-full border-0 p-0 text-[1.25rem] shadow-none outline-none'}
          value={title}
          onChange={e => onTitleInput(e.target.value)}
          placeholder={isCandidate ? 'Proposal candidate title' : 'Proposal title'}
        />
        <hr className={'mb-2 w-full'} />
        <FormControl
          className={'min-h-[340px] w-full border-0 p-0 shadow-none outline-none'}
          value={body}
          onChange={e => onBodyChange(e.target.value)}
          as="textarea"
          placeholder={bodyPlaceholder}
        />
      </InputGroup>
      {proposalText !== '' && (
        <div
          className={
            'border-brand-border-muted rounded-lg border px-4 pb-4 pt-2 shadow-none outline-none'
          }
        >
          <h3>
            <Trans>Preview</Trans>
          </h3>
          {title && (
            <>
              <h1 className={'font-londrina'}>{title}</h1>
              <hr />
            </>
          )}
          <ReactMarkdown
            className={
              'font-pt text-[1.1rem] [&_h1]:mt-4 [&_h1]:text-[1.7rem] [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:text-[1.5rem] [&_h2]:font-bold [&_h3]:text-[1.3rem] [&_img]:h-auto [&_img]:max-w-full'
            }
            remarkPlugins={[remarkBreaks]}
          >
            {proposalText}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
export default ProposalEditor;
