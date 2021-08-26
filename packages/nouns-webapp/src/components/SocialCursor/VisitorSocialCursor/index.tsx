import classes from './VisitorSocialCursor.module.css'

const VisitorSocialCursor: React.FC<{ key: string, x: number, y: number, emoji: string, color: string, message: string }> = props => {
	const { x, y, emoji, color, message } = props;

	return (
		<div
			className={classes.cursor}
			style={{ left: x, top: y, backgroundColor: color }}>
			<div className={classes.triangle} style={{backgroundColor: color}}></div>
			<i>{emoji}</i>
			<span>{message}</span>
		</div>
	)
}

export default VisitorSocialCursor;