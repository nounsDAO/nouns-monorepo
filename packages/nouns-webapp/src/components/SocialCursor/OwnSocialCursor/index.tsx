import useMousePosition from "../../../hooks/useMousePosition";
import useThrottledEffect from "../../../hooks/useThrottledEffect";
import { useState, useEffect, ChangeEvent } from "react";
import classes from './OwnSocialCursor.module.css'

export type OwnCursor = {
	x: number;
	y: number;
	emoji: string;
	color: string;
	message: string;
}

const OwnSocialCursor: React.FC<{ color: string, emoji: string, onChange: (c: OwnCursor) => void }> = props => {
	const { color, emoji, onChange } = props;

	const [writeable, setWriteable] = useState(false)
	const [message, setMessage] = useState("")
	const { clientX, clientY } = useMousePosition();

	const keyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "/") {
			event.preventDefault()
			const x = !writeable
			setWriteable(x);
			if (!x) {
				setMessage("")
			}

		} else if (event.key === "Escape") {
			event.preventDefault()
			if (message.length > 0) {
				setMessage("")
			} else {
				setWriteable(false);
			}
		}
	};

	const onMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
		setMessage(event.target.value)
	}

	useEffect(() => {
		document.addEventListener("keydown", keyDown)
		return () => {
			document.removeEventListener("keydown", keyDown)
		}
	})

	useThrottledEffect(() => {
		onChange({ x: clientX, y: clientY, color: color, emoji: emoji, message: message })
	}, [message, clientX, clientY, color, emoji], 50)

	return (
		<div
			className={classes.cursor}
			style={{ left: clientX, top: clientY, borderColor: color }}>
			<i>{emoji}</i>
			{writeable ? <input type="text" value={message} onChange={onMessageChange} placeholder="type message ..." autoFocus /> : null}
		</div>
	)
}

export default OwnSocialCursor;

