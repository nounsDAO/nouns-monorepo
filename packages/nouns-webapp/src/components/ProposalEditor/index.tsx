import classes from './ProposalEditor.module.css';
import { InputGroup, FormControl, FormText } from 'react-bootstrap';

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

  return (
    <InputGroup className={`${classes.proposalEditor} d-flex flex-column`}>
      <FormText>Proposal</FormText>
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
        onChange={e => onBodyInput(e.target.value)}
        as="textarea"
        placeholder={bodyPlaceholder}
      />
    </InputGroup>
  );
};
export default ProposalEditor;
