import OwnSocialCursor from "../SocialCursor/OwnSocialCursor";
import { OwnCursor } from "../SocialCursor/OwnSocialCursor";
import VisitorSocialCursor from "../SocialCursor/VisitorSocialCursor";
import { isTouchDevice } from "../../utils/isTouchDevice";
import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';

type Cursor = {
	id: string;
	x?: number;
	y?: number;
	emoji?: string;
	color?: string;
	message?: string;
	op?: string;
}

const SocialCursorCollection: React.FC<{}> = props => {
	const [cursors, setCursors] = useState<Cursor[]>([])
	const [ownCursorEmoji] = useState(randomEmoji())
	const [ownCursorColor] = useState(randomColor())
	const didUnmount = useRef(false);

	useEffect(() => {
		return () => {
			didUnmount.current = true;
		};
	}, []);

	const patchCursors = (c: Cursor) => {
		if (c.op === "delete") {
			const index = cursors.findIndex(x => x.id === c.id)
			if (index >= 0) {
				const updated = cursors.filter((_, i) => i !== index);
				setCursors(old => updated)
			}
			return
		}

		let found = false
		const updated = cursors.map(x => {
			if (x.id === c.id) {
				found = true
				return {
					id: x.id,
					x: c.x ? c.x : x.x,
					y: c.y ? c.y : x.y,
					emoji: c.emoji ? c.emoji : x.emoji,
					color: typeof c.color !== "undefined" ? c.color : x.color,
					message: typeof c.message !== "undefined" ? c.message : ""
				}
			}
			return x // return immutable
		})

		if (found) {
			setCursors(old => updated)
		} else {
			// not found, append c
			setCursors(old => [...old, c])
		}
	}

	const handleWebsocketMessage = (event: WebSocketEventMap['message']) => {
		const c: Cursor = JSON.parse(event.data);
		if (c.id === undefined) {
			return
		}
		patchCursors(c)
	}

	// Initialize Websocket
	const { sendMessage, readyState } = useWebSocket(
		process.env.REACT_APP_SOCIAL_CURSOR_WEBSOCKET_URL || "",
		{
			retryOnError: true,
			onMessage: handleWebsocketMessage,
			shouldReconnect: (closeEvent) => {
				return didUnmount.current === false;
			},
		});

	const onOwnSocialCursorChange = (c: OwnCursor) => {
		if (readyState === ReadyState.OPEN) {
			sendMessage(JSON.stringify(c))
		}
	}

	if (isTouchDevice) {
		// TODO think about how to render all of this on touch-only devices
		return null;
	}

	return (
		<div>
			<OwnSocialCursor
				color={ownCursorColor}
				emoji={ownCursorEmoji}
				onChange={onOwnSocialCursorChange}>
			</OwnSocialCursor>

			{cursors.map((c) => (
				<VisitorSocialCursor
					key={c.id}
					x={c.x || 0}
					y={c.y || 0}
					emoji={c.emoji || randomEmoji()}
					color={c.color || randomColor()}
					message={c.message || ""}>
				</VisitorSocialCursor>
			))}
		</div>
	)
}

const emojis = [
	"😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰",
	"😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭",
	"🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔",
	"😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯",
	"🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺",
	"😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫",
	"🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻",
	"👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉",
	"🙊", "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "❣", "💔",
	"❤️", "❤", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥", "💫",
	"💦", "💨", "🕳️", "🕳", "💣", "💬", "👁️‍🗨️", "👁‍🗨️", "👁️‍🗨", "👁‍🗨", "🗨️", "🗨", "🗯️",
	"🗯", "💭", "💤", "👋", "👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿", "🤚", "🤚🏻", "🤚🏼", "🤚🏽",
	"🤚🏾", "🤚🏿", "🖐️", "🖐", "🖐🏻", "🖐🏼", "🖐🏽", "🖐🏾", "🖐🏿", "✋", "✋🏻", "✋🏼", "✋🏽",
	"✋🏾", "✋🏿", "🖖", "🖖🏻", "🖖🏼", "🖖🏽", "🖖🏾", "🖖🏿", "👌", "👌🏻", "👌🏼", "👌🏽", "👌🏾",
	"👌🏿", "🤏", "🤏🏻", "🤏🏼", "🤏🏽", "🤏🏾", "🤏🏿", "✌️", "✌", "✌🏻", "✌🏼", "✌🏽", "✌🏾",
	"✌🏿", "🤞", "🤞🏻", "🤞🏼", "🤞🏽", "🤞🏾", "🤞🏿", "🤟", "🤟🏻", "🤟🏼", "🤟🏽", "🤟🏾", "🤟🏿",
	"🤘", "🤘🏻", "🤘🏼", "🤘🏽", "🤘🏾", "🤘🏿", "🤙", "🤙🏻", "🤙🏼", "🤙🏽", "🤙🏾", "🤙🏿", "👈",
	"👈🏻", "👈🏼", "👈🏽", "👈🏾", "👈🏿", "👉", "👉🏻", "👉🏼", "👉🏽", "👉🏾", "👉🏿", "👆", "👆🏻",
	"👆🏼", "👆🏽", "👆🏾", "👆🏿", "🖕", "🖕🏻", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿", "👇", "👇🏻", "👇🏼",
	"👇🏽", "👇🏾", "👇🏿", "☝️", "☝", "☝🏻", "☝🏼", "☝🏽", "☝🏾", "☝🏿", "👍", "👍🏻", "👍🏼",
	"👍🏽", "👍🏾", "👍🏿", "👎", "👎🏻", "👎🏼", "👎🏽", "👎🏾", "👎🏿", "✊", "✊🏻", "✊🏼", "✊🏽",
	"✊🏾", "✊🏿", "👊", "👊🏻", "👊🏼", "👊🏽", "👊🏾", "👊🏿", "🤛", "🤛🏻", "🤛🏼", "🤛🏽", "🤛🏾",
	"🤛🏿", "🤜", "🤜🏻", "🤜🏼", "🤜🏽", "🤜🏾", "🤜🏿", "👏", "👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿",
	"🙌", "🙌🏻", "🙌🏼", "🙌🏽", "🙌🏾", "🙌🏿", "👐", "👐🏻", "👐🏼", "👐🏽", "👐🏾", "👐🏿", "🤲",
	"🤲🏻", "🤲🏼", "🤲🏽", "🤲🏾", "🤲🏿", "🤝", "🙏", "🙏🏻", "🙏🏼", "🙏🏽", "🙏🏾", "🙏🏿", "✍️",
	"✍", "✍🏻", "✍🏼", "✍🏽", "✍🏾", "✍🏿", "💅", "💅🏻", "💅🏼", "💅🏽", "💅🏾", "💅🏿", "🤳",
	"🤳🏻", "🤳🏼", "🤳🏽", "🤳🏾", "🤳🏿", "💪", "💪🏻", "💪🏼", "💪🏽", "💪🏾", "💪🏿", "🦾", "🦿",
	"🦵", "🦵🏻", "🦵🏼", "🦵🏽", "🦵🏾", "🦵🏿", "🦶", "🦶🏻", "🦶🏼", "🦶🏽", "🦶🏾", "🦶🏿", "👂",
	"👂🏻", "👂🏼", "👂🏽", "👂🏾", "👂🏿", "🦻", "🦻🏻", "🦻🏼", "🦻🏽", "🦻🏾", "🦻🏿", "👃", "👃🏻",
	"👃🏼", "👃🏽", "👃🏾", "👃🏿", "🧠", "🦷", "🦴", "👀", "👁️", "👁", "👅", "👄", "👶",
	"👶🏻", "👶🏼", "👶🏽", "👶🏾", "👶🏿", "🧒", "🧒🏻", "🧒🏼", "🧒🏽", "🧒🏾", "🧒🏿", "👦", "👦🏻",
	"👦🏼", "👦🏽", "👦🏾", "👦🏿", "👧", "👧🏻", "👧🏼", "👧🏽", "👧🏾", "👧🏿", "🧑", "🧑🏻", "🧑🏼",
	"🧑🏽", "🧑🏾", "🧑🏿", "👱", "👱🏻", "👱🏼", "👱🏽", "👱🏾", "👱🏿", "👨", "👨🏻", "👨🏼", "👨🏽",
	"👨🏾", "👨🏿", "🧔", "🧔🏻", "🧔🏼", "🧔🏽", "🧔🏾", "🧔🏿", "👨‍🦰", "👨🏻‍🦰", "👨🏼‍🦰", "👨🏽‍🦰", "👨🏾‍🦰",
	"👨🏿‍🦰", "👨‍🦱", "👨🏻‍🦱", "👨🏼‍🦱", "👨🏽‍🦱", "👨🏾‍🦱", "👨🏿‍🦱", "👨‍🦳", "👨🏻‍🦳", "👨🏼‍🦳", "👨🏽‍🦳", "👨🏾‍🦳", "👨🏿‍🦳",
	"👨‍🦲", "👨🏻‍🦲", "👨🏼‍🦲", "👨🏽‍🦲", "👨🏾‍🦲", "👨🏿‍🦲", "👩", "👩🏻", "👩🏼", "👩🏽", "👩🏾", "👩🏿", "👩‍🦰",
	"👩🏻‍🦰", "👩🏼‍🦰", "👩🏽‍🦰", "👩🏾‍🦰", "👩🏿‍🦰", "🧑🏾‍", "🧑🏿‍", "👩‍🦱", "👩🏻‍🦱", "👩🏼‍🦱", "👩🏽‍🦱", "👩🏾‍🦱", "👩🏿‍🦱",
	"👩‍🦳", "👩🏻‍🦳", "👩🏼‍🦳", "👩🏽‍🦳", "👩🏾‍🦳", "👩🏿‍🦳", "👩‍🦲", "👩🏻‍🦲", "👩🏼‍🦲", "👩🏽‍🦲", "👩🏾‍🦲", "👩🏿‍🦲", "👱‍♀️",
	"👱‍♀", "👱🏻‍♀️", "👱🏻‍♀", "👱🏼‍♀️", "👱🏼‍♀", "👱🏽‍♀️", "👱🏽‍♀", "👱🏾‍♀️", "👱🏾‍♀", "👱🏿‍♀️", "👱🏿‍♀", "👱‍♂️", "👱‍♂",
	"👱🏻‍♂️", "👱🏻‍♂", "👱🏼‍♂️", "👱🏼‍♂", "👱🏽‍♂️", "👱🏽‍♂", "👱🏾‍♂️", "👱🏾‍♂", "👱🏿‍♂️", "👱🏿‍♂", "🧓", "🧓🏻", "🧓🏼",
	"🧓🏽", "🧓🏾", "🧓🏿", "👴", "👴🏻", "👴🏼", "👴🏽", "👴🏾", "👴🏿", "👵", "👵🏻", "👵🏼", "👵🏽",
	"👵🏾", "👵🏿", "🙍", "🙍🏻", "🙍🏼", "🙍🏽", "🙍🏾", "🙍🏿", "🙍‍♂️", "🙍‍♂", "🙍🏻‍♂️", "🙍🏻‍♂", "🙍🏼‍♂️",
	"🙍🏼‍♂", "🙍🏽‍♂️", "🙍🏽‍♂", "🙍🏾‍♂️", "🙍🏾‍♂", "🙍🏿‍♂️", "🙍🏿‍♂", "🙍‍♀️", "🙍‍♀", "🙍🏻‍♀️", "🙍🏻‍♀", "🙍🏼‍♀️", "🙍🏼‍♀",
	"🙍🏽‍♀️", "🙍🏽‍♀", "🙍🏾‍♀️", "🙍🏾‍♀", "🙍🏿‍♀️", "🙍🏿‍♀", "🙎", "🙎🏻", "🙎🏼", "🙎🏽", "🙎🏾", "🙎🏿", "🙎‍♂️",
	"🙎‍♂", "🙎🏻‍♂️", "🙎🏻‍♂", "🙎🏼‍♂️", "🙎🏼‍♂", "🙎🏽‍♂️", "🙎🏽‍♂", "🙎🏾‍♂️", "🙎🏾‍♂", "🙎🏿‍♂️", "🙎🏿‍♂", "🙎‍♀️", "🙎‍♀",
	"🙎🏻‍♀️", "🙎🏻‍♀", "🙎🏼‍♀️", "🙎🏼‍♀", "🙎🏽‍♀️", "🙎🏽‍♀", "🙎🏾‍♀️", "🙎🏾‍♀", "🙎🏿‍♀️", "🙎🏿‍♀", "🙅", "🙅🏻", "🙅🏼",
	"🙅🏽", "🙅🏾", "🙅🏿", "🙅‍♂️", "🙅‍♂", "🙅🏻‍♂️", "🙅🏻‍♂", "🙅🏼‍♂️", "🙅🏼‍♂", "🙅🏽‍♂️", "🙅🏽‍♂", "🙅🏾‍♂️", "🙅🏾‍♂",
	"🙅🏿‍♂️", "🙅🏿‍♂", "🙅‍♀️", "🙅‍♀", "🙅🏻‍♀️", "🙅🏻‍♀", "🙅🏼‍♀️", "🙅🏼‍♀", "🙅🏽‍♀️", "🙅🏽‍♀", "🙅🏾‍♀️", "🙅🏾‍♀", "🙅🏿‍♀️",
	"🙅🏿‍♀", "🙆", "🙆🏻", "🙆🏼", "🙆🏽", "🙆🏾", "🙆🏿", "🙆‍♂️", "🙆‍♂", "🙆🏻‍♂️", "🙆🏻‍♂", "🙆🏼‍♂️", "🙆🏼‍♂",
	"🙆🏽‍♂️", "🙆🏽‍♂", "🙆🏾‍♂️", "🙆🏾‍♂", "🙆🏿‍♂️", "🙆🏿‍♂", "🙆‍♀️", "🙆‍♀", "🙆🏻‍♀️", "🙆🏻‍♀", "🙆🏼‍♀️", "🙆🏼‍♀", "🙆🏽‍♀️",
	"🙆🏽‍♀", "🙆🏾‍♀️", "🙆🏾‍♀", "🙆🏿‍♀️", "🙆🏿‍♀", "💁", "💁🏻", "💁🏼", "💁🏽", "💁🏾", "💁🏿", "💁‍♂️", "💁‍♂",
	"💁🏻‍♂️", "💁🏻‍♂", "💁🏼‍♂️", "💁🏼‍♂", "💁🏽‍♂️", "💁🏽‍♂", "💁🏾‍♂️", "💁🏾‍♂", "💁🏿‍♂️", "💁🏿‍♂", "💁‍♀️", "💁‍♀", "💁🏻‍♀️",
	"💁🏻‍♀", "💁🏼‍♀️", "💁🏼‍♀", "💁🏽‍♀️", "💁🏽‍♀", "💁🏾‍♀️", "💁🏾‍♀", "💁🏿‍♀️", "💁🏿‍♀", "🙋", "🙋🏻", "🙋🏼", "🙋🏽",
	"🙋🏾", "🙋🏿", "🙋‍♂️", "🙋‍♂", "🙋🏻‍♂️", "🙋🏻‍♂", "🙋🏼‍♂️", "🙋🏼‍♂", "🙋🏽‍♂️", "🙋🏽‍♂", "🙋🏾‍♂️", "🙋🏾‍♂", "🙋🏿‍♂️",
	"🙋🏿‍♂", "🙋‍♀️", "🙋‍♀", "🙋🏻‍♀️", "🙋🏻‍♀", "🙋🏼‍♀️", "🙋🏼‍♀", "🙋🏽‍♀️", "🙋🏽‍♀", "🙋🏾‍♀️", "🙋🏾‍♀", "🙋🏿‍♀️", "🙋🏿‍♀",
	"🧏", "🧏🏻", "🧏🏼", "🧏🏽", "🧏🏾", "🧏🏿", "🧏‍♂️", "🧏‍♂", "🧏🏻‍♂️", "🧏🏻‍♂", "🧏🏼‍♂️", "🧏🏼‍♂", "🧏🏽‍♂️",
	"🧏🏽‍♂", "🧏🏾‍♂️", "🧏🏾‍♂", "🧏🏿‍♂️", "🧏🏿‍♂", "🧏‍♀️", "🧏‍♀", "🧏🏻‍♀️", "🧏🏻‍♀", "🧏🏼‍♀️", "🧏🏼‍♀", "🧏🏽‍♀️", "🧏🏽‍♀",
	"🧏🏾‍♀️", "🧏🏾‍♀", "🧏🏿‍♀️", "🧏🏿‍♀", "🙇", "🙇🏻", "🙇🏼", "🙇🏽", "🙇🏾", "🙇🏿", "🙇‍♂️", "🙇‍♂", "🙇🏻‍♂️",
	"🙇🏻‍♂", "🙇🏼‍♂️", "🙇🏼‍♂", "🙇🏽‍♂️", "🙇🏽‍♂", "🙇🏾‍♂️", "🙇🏾‍♂", "🙇🏿‍♂️", "🙇🏿‍♂", "🙇‍♀️", "🙇‍♀", "🙇🏻‍♀️", "🙇🏻‍♀",
	"🙇🏼‍♀️", "🙇🏼‍♀", "🙇🏽‍♀️", "🙇🏽‍♀", "🙇🏾‍♀️", "🙇🏾‍♀", "🙇🏿‍♀️", "🙇🏿‍♀", "🤦", "🤦🏻", "🤦🏼", "🤦🏽", "🤦🏾",
	"🤦🏿", "🤦‍♂️", "🤦‍♂", "🤦🏻‍♂️", "🤦🏻‍♂", "🤦🏼‍♂️", "🤦🏼‍♂", "🤦🏽‍♂️", "🤦🏽‍♂", "🤦🏾‍♂️", "🤦🏾‍♂", "🤦🏿‍♂️", "🤦🏿‍♂",
	"🤦‍♀️", "🤦‍♀", "🤦🏻‍♀️", "🤦🏻‍♀", "🤦🏼‍♀️", "🤦🏼‍♀", "🤦🏽‍♀️", "🤦🏽‍♀", "🤦🏾‍♀️", "🤦🏾‍♀", "🤦🏿‍♀️", "🤦🏿‍♀", "🤷",
	"🤷🏻", "🤷🏼", "🤷🏽", "🤷🏾", "🤷🏿", "🤷‍♂️", "🤷‍♂", "🤷🏻‍♂️", "🤷🏻‍♂", "🤷🏼‍♂️", "🤷🏼‍♂", "🤷🏽‍♂️", "🤷🏽‍♂",
	"🤷🏾‍♂️", "🤷🏾‍♂", "🤷🏿‍♂️", "🤷🏿‍♂", "🤷‍♀️", "🤷‍♀", "🤷🏻‍♀️", "🤷🏻‍♀", "🤷🏼‍♀️", "🤷🏼‍♀", "🤷🏽‍♀️", "🤷🏽‍♀", "🤷🏾‍♀️",
	"🤷🏾‍♀", "🤷🏿‍♀️", "🤷🏿‍♀", "👨‍⚕️", "👨‍⚕", "👨🏻‍⚕️", "👨🏻‍⚕", "👨🏼‍⚕️", "👨🏼‍⚕", "👨🏽‍⚕️", "👨🏽‍⚕", "👨🏾‍⚕️", "👨🏾‍⚕",
	"👨🏿‍⚕️", "👨🏿‍⚕", "👩‍⚕️", "👩‍⚕", "👩🏻‍⚕️", "👩🏻‍⚕", "👩🏼‍⚕️", "👩🏼‍⚕", "👩🏽‍⚕️", "👩🏽‍⚕", "👩🏾‍⚕️", "👩🏾‍⚕", "👩🏿‍⚕️",
	"👩🏿‍⚕", "👨‍🎓", "👨🏻‍🎓", "👨🏼‍🎓", "👨🏽‍🎓", "👨🏾‍🎓", "👨🏿‍🎓", "👩‍🎓", "👩🏻‍🎓", "👩🏼‍🎓", "👩🏽‍🎓", "👩🏾‍🎓", "👩🏿‍🎓",
	"👨‍🏫", "👨🏻‍🏫", "👨🏼‍🏫", "👨🏽‍🏫", "👨🏾‍🏫", "👨🏿‍🏫", "👩‍🏫", "👩🏻‍🏫", "👩🏼‍🏫", "👩🏽‍🏫", "👩🏾‍🏫", "👩🏿‍🏫", "👨‍⚖️",
	"👨‍⚖", "👨🏻‍⚖️", "👨🏻‍⚖", "👨🏼‍⚖️", "👨🏼‍⚖", "👨🏽‍⚖️", "👨🏽‍⚖", "👨🏾‍⚖️", "👨🏾‍⚖", "👨🏿‍⚖️", "👨🏿‍⚖", "👩‍⚖️", "👩‍⚖",
	"👩🏻‍⚖️", "👩🏻‍⚖", "👩🏼‍⚖️", "👩🏼‍⚖", "👩🏽‍⚖️", "👩🏽‍⚖", "👩🏾‍⚖️", "👩🏾‍⚖", "👩🏿‍⚖️", "👩🏿‍⚖", "👨‍🌾", "👨🏻‍🌾", "👨🏼‍🌾",
	"👨🏽‍🌾", "👨🏾‍🌾", "👨🏿‍🌾", "👩‍🌾", "👩🏻‍🌾", "👩🏼‍🌾", "👩🏽‍🌾", "👩🏾‍🌾", "👩🏿‍🌾", "👨‍🍳", "👨🏻‍🍳", "👨🏼‍🍳", "👨🏽‍🍳",
	"👨🏾‍🍳", "👨🏿‍🍳", "👩‍🍳", "👩🏻‍🍳", "👩🏼‍🍳", "👩🏽‍🍳", "👩🏾‍🍳", "👩🏿‍🍳", "👨‍🔧", "👨🏻‍🔧", "👨🏼‍🔧", "👨🏽‍🔧", "👨🏾‍🔧",
	"👨🏿‍🔧", "👩‍🔧", "👩🏻‍🔧", "👩🏼‍🔧", "👩🏽‍🔧", "👩🏾‍🔧", "👩🏿‍🔧", "👨‍🏭", "👨🏻‍🏭", "👨🏼‍🏭", "👨🏽‍🏭", "👨🏾‍🏭", "👨🏿‍🏭",
	"👩‍🏭", "👩🏻‍🏭", "👩🏼‍🏭", "👩🏽‍🏭", "👩🏾‍🏭", "👩🏿‍🏭", "👨‍💼", "👨🏻‍💼", "👨🏼‍💼", "👨🏽‍💼", "👨🏾‍💼", "👨🏿‍💼", "👩‍💼",
	"👩🏻‍💼", "👩🏼‍💼", "👩🏽‍💼", "👩🏾‍💼", "👩🏿‍💼", "👨‍🔬", "👨🏻‍🔬", "👨🏼‍🔬", "👨🏽‍🔬", "👨🏾‍🔬", "👨🏿‍🔬", "👩‍🔬", "👩🏻‍🔬",
	"👩🏼‍🔬", "👩🏽‍🔬", "👩🏾‍🔬", "👩🏿‍🔬", "👨‍💻", "👨🏻‍💻", "👨🏼‍💻", "👨🏽‍💻", "👨🏾‍💻", "👨🏿‍💻", "👩‍💻", "👩🏻‍💻", "👩🏼‍💻",
	"👩🏽‍💻", "👩🏾‍💻", "👩🏿‍💻", "👨‍🎤", "👨🏻‍🎤", "👨🏼‍🎤", "👨🏽‍🎤", "👨🏾‍🎤", "👨🏿‍🎤", "👩‍🎤", "👩🏻‍🎤", "👩🏼‍🎤", "👩🏽‍🎤",
	"👩🏾‍🎤", "👩🏿‍🎤", "👨‍🎨", "👨🏻‍🎨", "👨🏼‍🎨", "👨🏽‍🎨", "👨🏾‍🎨", "👨🏿‍🎨", "👩‍🎨", "👩🏻‍🎨", "👩🏼‍🎨", "👩🏽‍🎨", "👩🏾‍🎨",
	"👩🏿‍🎨", "👨‍✈️", "👨‍✈", "👨🏻‍✈️", "👨🏻‍✈", "👨🏼‍✈️", "👨🏼‍✈", "👨🏽‍✈️", "👨🏽‍✈", "👨🏾‍✈️", "👨🏾‍✈", "👨🏿‍✈️", "👨🏿‍✈",
	"👩‍✈️", "👩‍✈", "👩🏻‍✈️", "👩🏻‍✈", "👩🏼‍✈️", "👩🏼‍✈", "👩🏽‍✈️", "👩🏽‍✈", "👩🏾‍✈️", "👩🏾‍✈", "👩🏿‍✈️", "👩🏿‍✈", "👨‍🚀",
	"👨🏻‍🚀", "👨🏼‍🚀", "👨🏽‍🚀", "👨🏾‍🚀", "👨🏿‍🚀", "👩‍🚀", "👩🏻‍🚀", "👩🏼‍🚀", "👩🏽‍🚀", "👩🏾‍🚀", "👩🏿‍🚀", "👨‍🚒", "👨🏻‍🚒",
	"👨🏼‍🚒", "👨🏽‍🚒", "👨🏾‍🚒", "👨🏿‍🚒", "👩‍🚒", "👩🏻‍🚒", "👩🏼‍🚒", "👩🏽‍🚒", "👩🏾‍🚒", "👩🏿‍🚒", "👮", "👮🏻", "👮🏼",
	"👮🏽", "👮🏾", "👮🏿", "👮‍♂️", "👮‍♂", "👮🏻‍♂️", "👮🏻‍♂", "👮🏼‍♂️", "👮🏼‍♂", "👮🏽‍♂️", "👮🏽‍♂", "👮🏾‍♂️", "👮🏾‍♂",
	"👮🏿‍♂️", "👮🏿‍♂", "👮‍♀️", "👮‍♀", "👮🏻‍♀️", "👮🏻‍♀", "👮🏼‍♀️", "👮🏼‍♀", "👮🏽‍♀️", "👮🏽‍♀", "👮🏾‍♀️", "👮🏾‍♀", "👮🏿‍♀️",
	"👮🏿‍♀", "🕵️", "🕵", "🕵🏻", "🕵🏼", "🕵🏽", "🕵🏾", "🕵🏿", "🕵️‍♂️", "🕵‍♂️", "🕵️‍♂", "🕵‍♂", "🕵🏻‍♂️",
	"🕵🏻‍♂", "🕵🏼‍♂️", "🕵🏼‍♂", "🕵🏽‍♂️", "🕵🏽‍♂", "🕵🏾‍♂️", "🕵🏾‍♂", "🕵🏿‍♂️", "🕵🏿‍♂", "🕵️‍♀️", "🕵‍♀️", "🕵️‍♀", "🕵‍♀",
	"🕵🏻‍♀️", "🕵🏻‍♀", "🕵🏼‍♀️", "🕵🏼‍♀", "🕵🏽‍♀️", "🕵🏽‍♀", "🕵🏾‍♀️", "🕵🏾‍♀", "🕵🏿‍♀️", "🕵🏿‍♀", "💂", "💂🏻", "💂🏼",
	"💂🏽", "💂🏾", "💂🏿", "💂‍♂️", "💂‍♂", "💂🏻‍♂️", "💂🏻‍♂", "💂🏼‍♂️", "💂🏼‍♂", "💂🏽‍♂️", "💂🏽‍♂", "💂🏾‍♂️", "💂🏾‍♂",
	"💂🏿‍♂️", "💂🏿‍♂", "💂‍♀️", "💂‍♀", "💂🏻‍♀️", "💂🏻‍♀", "💂🏼‍♀️", "💂🏼‍♀", "💂🏽‍♀️", "💂🏽‍♀", "💂🏾‍♀️", "💂🏾‍♀", "💂🏿‍♀️",
	"💂🏿‍♀", "👷", "👷🏻", "👷🏼", "👷🏽", "👷🏾", "👷🏿", "👷‍♂️", "👷‍♂", "👷🏻‍♂️", "👷🏻‍♂", "👷🏼‍♂️", "👷🏼‍♂",
	"👷🏽‍♂️", "👷🏽‍♂", "👷🏾‍♂️", "👷🏾‍♂", "👷🏿‍♂️", "👷🏿‍♂", "👷‍♀️", "👷‍♀", "👷🏻‍♀️", "👷🏻‍♀", "👷🏼‍♀️", "👷🏼‍♀", "👷🏽‍♀️",
	"👷🏽‍♀", "👷🏾‍♀️", "👷🏾‍♀", "👷🏿‍♀️", "👷🏿‍♀", "🤴", "🤴🏻", "🤴🏼", "🤴🏽", "🤴🏾", "🤴🏿", "👸", "👸🏻",
	"👸🏼", "👸🏽", "👸🏾", "👸🏿", "👳", "👳🏻", "👳🏼", "👳🏽", "👳🏾", "👳🏿", "👳‍♂️", "👳‍♂", "👳🏻‍♂️",
	"👳🏻‍♂", "👳🏼‍♂️", "👳🏼‍♂", "👳🏽‍♂️", "👳🏽‍♂", "👳🏾‍♂️", "👳🏾‍♂", "👳🏿‍♂️", "👳🏿‍♂", "👳‍♀️", "👳‍♀", "👳🏻‍♀️", "👳🏻‍♀",
	"👳🏼‍♀️", "👳🏼‍♀", "👳🏽‍♀️", "👳🏽‍♀", "👳🏾‍♀️", "👳🏾‍♀", "👳🏿‍♀️", "👳🏿‍♀", "👲", "👲🏻", "👲🏼", "👲🏽", "👲🏾",
	"👲🏿", "🧕", "🧕🏻", "🧕🏼", "🧕🏽", "🧕🏾", "🧕🏿", "🤵", "🤵🏻", "🤵🏼", "🤵🏽", "🤵🏾", "🤵🏿",
	"👰", "👰🏻", "👰🏼", "👰🏽", "👰🏾", "👰🏿", "🤰", "🤰🏻", "🤰🏼", "🤰🏽", "🤰🏾", "🤰🏿", "🤱",
	"🤱🏻", "🤱🏼", "🤱🏽", "🤱🏾", "🤱🏿", "👩‍🍼", "👩🏻‍🍼", "👩🏼‍🍼", "👩🏽‍🍼", "👩🏾‍🍼", "👩🏿‍🍼", "👨‍🍼", "👨🏻‍🍼",
	"👨🏼‍🍼", "👨🏽‍🍼", "👨🏾‍🍼", "👨🏿‍🍼", "🧑‍🍼", "🧑🏻‍🍼", "🧑🏼‍🍼", "🧑🏽‍🍼", "🧑🏾‍🍼", "🧑🏿‍🍼", "👼", "👼🏻", "👼🏼",
	"👼🏽", "👼🏾", "👼🏿", "🎅", "🎅🏻", "🎅🏼", "🎅🏽", "🎅🏾", "🎅🏿", "🤶", "🤶🏻", "🤶🏼", "🤶🏽",
	"🤶🏾", "🤶🏿", "🦸", "🦸🏻", "🦸🏼", "🦸🏽", "🦸🏾", "🦸🏿", "🦸‍♂️", "🦸‍♂", "🦸🏻‍♂️", "🦸🏻‍♂", "🦸🏼‍♂️",
	"🦸🏼‍♂", "🦸🏽‍♂️", "🦸🏽‍♂", "🦸🏾‍♂️", "🦸🏾‍♂", "🦸🏿‍♂️", "🦸🏿‍♂", "🦸‍♀️", "🦸‍♀", "🦸🏻‍♀️", "🦸🏻‍♀", "🦸🏼‍♀️", "🦸🏼‍♀",
	"🦸🏽‍♀️", "🦸🏽‍♀", "🦸🏾‍♀️", "🦸🏾‍♀", "🦸🏿‍♀️", "🦸🏿‍♀", "🦹", "🦹🏻", "🦹🏼", "🦹🏽", "🦹🏾", "🦹🏿", "🦹‍♂️",
	"🦹‍♂", "🦹🏻‍♂️", "🦹🏻‍♂", "🦹🏼‍♂️", "🦹🏼‍♂", "🦹🏽‍♂️", "🦹🏽‍♂", "🦹🏾‍♂️", "🦹🏾‍♂", "🦹🏿‍♂️", "🦹🏿‍♂", "🦹‍♀️", "🦹‍♀",
	"🦹🏻‍♀️", "🦹🏻‍♀", "🦹🏼‍♀️", "🦹🏼‍♀", "🦹🏽‍♀️", "🦹🏽‍♀", "🦹🏾‍♀️", "🦹🏾‍♀", "🦹🏿‍♀️", "🦹🏿‍♀", "🧙", "🧙🏻", "🧙🏼",
	"🧙🏽", "🧙🏾", "🧙🏿", "🧙‍♂️", "🧙‍♂", "🧙🏻‍♂️", "🧙🏻‍♂", "🧙🏼‍♂️", "🧙🏼‍♂", "🧙🏽‍♂️", "🧙🏽‍♂", "🧙🏾‍♂️", "🧙🏾‍♂",
	"🧙🏿‍♂️", "🧙🏿‍♂", "🧙‍♀️", "🧙‍♀", "🧙🏻‍♀️", "🧙🏻‍♀", "🧙🏼‍♀️", "🧙🏼‍♀", "🧙🏽‍♀️", "🧙🏽‍♀", "🧙🏾‍♀️", "🧙🏾‍♀", "🧙🏿‍♀️",
	"🧙🏿‍♀", "🧚", "🧚🏻", "🧚🏼", "🧚🏽", "🧚🏾", "🧚🏿", "🧚‍♂️", "🧚‍♂", "🧚🏻‍♂️", "🧚🏻‍♂", "🧚🏼‍♂️", "🧚🏼‍♂",
	"🧚🏽‍♂️", "🧚🏽‍♂", "🧚🏾‍♂️", "🧚🏾‍♂", "🧚🏿‍♂️", "🧚🏿‍♂", "🧚‍♀️", "🧚‍♀", "🧚🏻‍♀️", "🧚🏻‍♀", "🧚🏼‍♀️", "🧚🏼‍♀", "🧚🏽‍♀️",
	"🧚🏽‍♀", "🧚🏾‍♀️", "🧚🏾‍♀", "🧚🏿‍♀️", "🧚🏿‍♀", "🧛", "🧛🏻", "🧛🏼", "🧛🏽", "🧛🏾", "🧛🏿", "🧛‍♂️", "🧛‍♂",
	"🧛🏻‍♂️", "🧛🏻‍♂", "🧛🏼‍♂️", "🧛🏼‍♂", "🧛🏽‍♂️", "🧛🏽‍♂", "🧛🏾‍♂️", "🧛🏾‍♂", "🧛🏿‍♂️", "🧛🏿‍♂", "🧛‍♀️", "🧛‍♀", "🧛🏻‍♀️",
	"🧛🏻‍♀", "🧛🏼‍♀️", "🧛🏼‍♀", "🧛🏽‍♀️", "🧛🏽‍♀", "🧛🏾‍♀️", "🧛🏾‍♀", "🧛🏿‍♀️", "🧛🏿‍♀", "🧜", "🧜🏻", "🧜🏼", "🧜🏽",
	"🧜🏾", "🧜🏿", "🧜‍♂️", "🧜‍♂", "🧜🏻‍♂️", "🧜🏻‍♂", "🧜🏼‍♂️", "🧜🏼‍♂", "🧜🏽‍♂️", "🧜🏽‍♂", "🧜🏾‍♂️", "🧜🏾‍♂", "🧜🏿‍♂️",
	"🧜🏿‍♂", "🧜‍♀️", "🧜‍♀", "🧜🏻‍♀️", "🧜🏻‍♀", "🧜🏼‍♀️", "🧜🏼‍♀", "🧜🏽‍♀️", "🧜🏽‍♀", "🧜🏾‍♀️", "🧜🏾‍♀", "🧜🏿‍♀️", "🧜🏿‍♀",
	"🧝", "🧝🏻", "🧝🏼", "🧝🏽", "🧝🏾", "🧝🏿", "🧝‍♂️", "🧝‍♂", "🧝🏻‍♂️", "🧝🏻‍♂", "🧝🏼‍♂️", "🧝🏼‍♂", "🧝🏽‍♂️",
	"🧝🏽‍♂", "🧝🏾‍♂️", "🧝🏾‍♂", "🧝🏿‍♂️", "🧝🏿‍♂", "🧝‍♀️", "🧝‍♀", "🧝🏻‍♀️", "🧝🏻‍♀", "🧝🏼‍♀️", "🧝🏼‍♀", "🧝🏽‍♀️", "🧝🏽‍♀",
	"🧝🏾‍♀️", "🧝🏾‍♀", "🧝🏿‍♀️", "🧝🏿‍♀", "🧞", "🧞‍♂️", "🧞‍♂", "🧞‍♀️", "🧞‍♀", "🧟", "🧟‍♂️", "🧟‍♂", "🧟‍♀️",
	"🧟‍♀", "💆", "💆🏻", "💆🏼", "💆🏽", "💆🏾", "💆🏿", "💆‍♂️", "💆‍♂", "💆🏻‍♂️", "💆🏻‍♂", "💆🏼‍♂️", "💆🏼‍♂",
	"💆🏽‍♂️", "💆🏽‍♂", "💆🏾‍♂️", "💆🏾‍♂", "💆🏿‍♂️", "💆🏿‍♂", "💆‍♀️", "💆‍♀", "💆🏻‍♀️", "💆🏻‍♀", "💆🏼‍♀️", "💆🏼‍♀", "💆🏽‍♀️",
	"💆🏽‍♀", "💆🏾‍♀️", "💆🏾‍♀", "💆🏿‍♀️", "💆🏿‍♀", "💇", "💇🏻", "💇🏼", "💇🏽", "💇🏾", "💇🏿", "💇‍♂️", "💇‍♂",
	"💇🏻‍♂️", "💇🏻‍♂", "💇🏼‍♂️", "💇🏼‍♂", "💇🏽‍♂️", "💇🏽‍♂", "💇🏾‍♂️", "💇🏾‍♂", "💇🏿‍♂️", "💇🏿‍♂", "💇‍♀️", "💇‍♀", "💇🏻‍♀️",
	"💇🏻‍♀", "💇🏼‍♀️", "💇🏼‍♀", "💇🏽‍♀️", "💇🏽‍♀", "💇🏾‍♀️", "💇🏾‍♀", "💇🏿‍♀️", "💇🏿‍♀", "🚶", "🚶🏻", "🚶🏼", "🚶🏽",
	"🚶🏾", "🚶🏿", "🚶‍♂️", "🚶‍♂", "🚶🏻‍♂️", "🚶🏻‍♂", "🚶🏼‍♂️", "🚶🏼‍♂", "🚶🏽‍♂️", "🚶🏽‍♂", "🚶🏾‍♂️", "🚶🏾‍♂", "🚶🏿‍♂️",
	"🚶🏿‍♂", "🚶‍♀️", "🚶‍♀", "🚶🏻‍♀️", "🚶🏻‍♀", "🚶🏼‍♀️", "🚶🏼‍♀", "🚶🏽‍♀️", "🚶🏽‍♀", "🚶🏾‍♀️", "🚶🏾‍♀", "🚶🏿‍♀️", "🚶🏿‍♀",
	"🧍", "🧍🏻", "🧍🏼", "🧍🏽", "🧍🏾", "🧍🏿", "🧍‍♂️", "🧍‍♂", "🧍🏻‍♂️", "🧍🏻‍♂", "🧍🏼‍♂️", "🧍🏼‍♂", "🧍🏽‍♂️",
	"🧍🏽‍♂", "🧍🏾‍♂️", "🧍🏾‍♂", "🧍🏿‍♂️", "🧍🏿‍♂", "🧍‍♀️", "🧍‍♀", "🧍🏻‍♀️", "🧍🏻‍♀", "🧍🏼‍♀️", "🧍🏼‍♀", "🧍🏽‍♀️", "🧍🏽‍♀",
	"🧍🏾‍♀️", "🧍🏾‍♀", "🧍🏿‍♀️", "🧍🏿‍♀", "🧎", "🧎🏻", "🧎🏼", "🧎🏽", "🧎🏾", "🧎🏿", "🧎‍♂️", "🧎‍♂", "🧎🏻‍♂️",
	"🧎🏻‍♂", "🧎🏼‍♂️", "🧎🏼‍♂", "🧎🏽‍♂️", "🧎🏽‍♂", "🧎🏾‍♂️", "🧎🏾‍♂", "🧎🏿‍♂️", "🧎🏿‍♂", "🧎‍♀️", "🧎‍♀", "🧎🏻‍♀️", "🧎🏻‍♀",
	"🧎🏼‍♀️", "🧎🏼‍♀", "🧎🏽‍♀️", "🧎🏽‍♀", "🧎🏾‍♀️", "🧎🏾‍♀", "🧎🏿‍♀️", "🧎🏿‍♀", "👨‍🦯", "👨🏻‍🦯", "👨🏼‍🦯", "👨🏽‍🦯", "👨🏾‍🦯",
	"👨🏿‍🦯", "👩‍🦯", "👩🏻‍🦯", "👩🏼‍🦯", "👩🏽‍🦯", "👩🏾‍🦯", "👩🏿‍🦯", "👨‍🦼", "👨🏻‍🦼", "👨🏼‍🦼", "👨🏽‍🦼", "👨🏾‍🦼", "👨🏿‍🦼",
	"👩‍🦼", "👩🏻‍🦼", "👩🏼‍🦼", "👩🏽‍🦼", "👩🏾‍🦼", "👩🏿‍🦼", "👨‍🦽", "👨🏻‍🦽", "👨🏼‍🦽", "👨🏽‍🦽", "👨🏾‍🦽", "👨🏿‍🦽", "👩‍🦽",
	"👩🏻‍🦽", "👩🏼‍🦽", "👩🏽‍🦽", "👩🏾‍🦽", "👩🏿‍🦽", "🏃", "🏃🏻", "🏃🏼", "🏃🏽", "🏃🏾", "🏃🏿", "🏃‍♂️", "🏃‍♂",
	"🏃🏻‍♂️", "🏃🏻‍♂", "🏃🏼‍♂️", "🏃🏼‍♂", "🏃🏽‍♂️", "🏃🏽‍♂", "🏃🏾‍♂️", "🏃🏾‍♂", "🏃🏿‍♂️", "🏃🏿‍♂", "🏃‍♀️", "🏃‍♀", "🏃🏻‍♀️",
	"🏃🏻‍♀", "🏃🏼‍♀️", "🏃🏼‍♀", "🏃🏽‍♀️", "🏃🏽‍♀", "🏃🏾‍♀️", "🏃🏾‍♀", "🏃🏿‍♀️", "🏃🏿‍♀", "💃", "💃🏻", "💃🏼", "💃🏽",
	"💃🏾", "💃🏿", "🕺", "🕺🏻", "🕺🏼", "🕺🏽", "🕺🏾", "🕺🏿", "🕴️", "🕴", "🕴🏻", "🕴🏼", "🕴🏽",
	"🕴🏾", "🕴🏿", "👯", "👯‍♂️", "👯‍♂", "👯‍♀️", "👯‍♀", "🧖", "🧖🏻", "🧖🏼", "🧖🏽", "🧖🏾", "🧖🏿",
	"🧖‍♂️", "🧖‍♂", "🧖🏻‍♂️", "🧖🏻‍♂", "🧖🏼‍♂️", "🧖🏼‍♂", "🧖🏽‍♂️", "🧖🏽‍♂", "🧖🏾‍♂️", "🧖🏾‍♂", "🧖🏿‍♂️", "🧖🏿‍♂", "🧖‍♀️",
	"🧖‍♀", "🧖🏻‍♀️", "🧖🏻‍♀", "🧖🏼‍♀️", "🧖🏼‍♀", "🧖🏽‍♀️", "🧖🏽‍♀", "🧖🏾‍♀️", "🧖🏾‍♀", "🧖🏿‍♀️", "🧖🏿‍♀", "🧗", "🧗🏻",
	"🧗🏼", "🧗🏽", "🧗🏾", "🧗🏿", "🧗‍♂️", "🧗‍♂", "🧗🏻‍♂️", "🧗🏻‍♂", "🧗🏼‍♂️", "🧗🏼‍♂", "🧗🏽‍♂️", "🧗🏽‍♂", "🧗🏾‍♂️",
	"🧗🏾‍♂", "🧗🏿‍♂️", "🧗🏿‍♂", "🧗‍♀️", "🧗‍♀", "🧗🏻‍♀️", "🧗🏻‍♀", "🧗🏼‍♀️", "🧗🏼‍♀", "🧗🏽‍♀️", "🧗🏽‍♀", "🧗🏾‍♀️", "🧗🏾‍♀",
	"🧗🏿‍♀️", "🧗🏿‍♀", "🤺", "🏇", "🏇🏻", "🏇🏼", "🏇🏽", "🏇🏾", "🏇🏿", "⛷️", "⛷", "🏂", "🏂🏻",
	"🏂🏼", "🏂🏽", "🏂🏾", "🏂🏿", "🏌️", "🏌", "🏌🏻", "🏌🏼", "🏌🏽", "🏌🏾", "🏌🏿", "🏌️‍♂️", "🏌‍♂️",
	"🏌️‍♂", "🏌‍♂", "🏌🏻‍♂️", "🏌🏻‍♂", "🏌🏼‍♂️", "🏌🏼‍♂", "🏌🏽‍♂️", "🏌🏽‍♂", "🏌🏾‍♂️", "🏌🏾‍♂", "🏌🏿‍♂️", "🏌🏿‍♂", "🏌️‍♀️",
	"🏌‍♀️", "🏌️‍♀", "🏌‍♀", "🏌🏻‍♀️", "🏌🏻‍♀", "🏌🏼‍♀️", "🏌🏼‍♀", "🏌🏽‍♀️", "🏌🏽‍♀", "🏌🏾‍♀️", "🏌🏾‍♀", "🏌🏿‍♀️", "🏌🏿‍♀",
	"🏄", "🏄🏻", "🏄🏼", "🏄🏽", "🏄🏾", "🏄🏿", "🏄‍♂️", "🏄‍♂", "🏄🏻‍♂️", "🏄🏻‍♂", "🏄🏼‍♂️", "🏄🏼‍♂", "🏄🏽‍♂️",
	"🏄🏽‍♂", "🏄🏾‍♂️", "🏄🏾‍♂", "🏄🏿‍♂️", "🏄🏿‍♂", "🏄‍♀️", "🏄‍♀", "🏄🏻‍♀️", "🏄🏻‍♀", "🏄🏼‍♀️", "🏄🏼‍♀", "🏄🏽‍♀️", "🏄🏽‍♀",
	"🏄🏾‍♀️", "🏄🏾‍♀", "🏄🏿‍♀️", "🏄🏿‍♀", "🚣", "🚣🏻", "🚣🏼", "🚣🏽", "🚣🏾", "🚣🏿", "🚣‍♂️", "🚣‍♂", "🚣🏻‍♂️",
	"🚣🏻‍♂", "🚣🏼‍♂️", "🚣🏼‍♂", "🚣🏽‍♂️", "🚣🏽‍♂", "🚣🏾‍♂️", "🚣🏾‍♂", "🚣🏿‍♂️", "🚣🏿‍♂", "🚣‍♀️", "🚣‍♀", "🚣🏻‍♀️", "🚣🏻‍♀",
	"🚣🏼‍♀️", "🚣🏼‍♀", "🚣🏽‍♀️", "🚣🏽‍♀", "🚣🏾‍♀️", "🚣🏾‍♀", "🚣🏿‍♀️", "🚣🏿‍♀", "🏊", "🏊🏻", "🏊🏼", "🏊🏽", "🏊🏾",
	"🏊🏿", "🏊‍♂️", "🏊‍♂", "🏊🏻‍♂️", "🏊🏻‍♂", "🏊🏼‍♂️", "🏊🏼‍♂", "🏊🏽‍♂️", "🏊🏽‍♂", "🏊🏾‍♂️", "🏊🏾‍♂", "🏊🏿‍♂️", "🏊🏿‍♂",
	"🏊‍♀️", "🏊‍♀", "🏊🏻‍♀️", "🏊🏻‍♀", "🏊🏼‍♀️", "🏊🏼‍♀", "🏊🏽‍♀️", "🏊🏽‍♀", "🏊🏾‍♀️", "🏊🏾‍♀", "🏊🏿‍♀️", "🏊🏿‍♀", "⛹️",
	"⛹", "⛹🏻", "⛹🏼", "⛹🏽", "⛹🏾", "⛹🏿", "⛹️‍♂️", "⛹‍♂️", "⛹️‍♂", "⛹‍♂", "⛹🏻‍♂️", "⛹🏻‍♂", "⛹🏼‍♂️",
	"⛹🏼‍♂", "⛹🏽‍♂️", "⛹🏽‍♂", "⛹🏾‍♂️", "⛹🏾‍♂", "⛹🏿‍♂️", "⛹🏿‍♂", "⛹️‍♀️", "⛹‍♀️", "⛹️‍♀", "⛹‍♀", "⛹🏻‍♀️", "⛹🏻‍♀",
	"⛹🏼‍♀️", "⛹🏼‍♀", "⛹🏽‍♀️", "⛹🏽‍♀", "⛹🏾‍♀️", "⛹🏾‍♀", "⛹🏿‍♀️", "⛹🏿‍♀", "🏋️", "🏋", "🏋🏻", "🏋🏼", "🏋🏽",
	"🏋🏾", "🏋🏿", "🏋️‍♂️", "🏋‍♂️", "🏋️‍♂", "🏋‍♂", "🏋🏻‍♂️", "🏋🏻‍♂", "🏋🏼‍♂️", "🏋🏼‍♂", "🏋🏽‍♂️", "🏋🏽‍♂", "🏋🏾‍♂️",
	"🏋🏾‍♂", "🏋🏿‍♂️", "🏋🏿‍♂", "🏋️‍♀️", "🏋‍♀️", "🏋️‍♀", "🏋‍♀", "🏋🏻‍♀️", "🏋🏻‍♀", "🏋🏼‍♀️", "🏋🏼‍♀", "🏋🏽‍♀️", "🏋🏽‍♀",
	"🏋🏾‍♀️", "🏋🏾‍♀", "🏋🏿‍♀️", "🏋🏿‍♀", "🚴", "🚴🏻", "🚴🏼", "🚴🏽", "🚴🏾", "🚴🏿", "🚴‍♂️", "🚴‍♂", "🚴🏻‍♂️",
	"🚴🏻‍♂", "🚴🏼‍♂️", "🚴🏼‍♂", "🚴🏽‍♂️", "🚴🏽‍♂", "🚴🏾‍♂️", "🚴🏾‍♂", "🚴🏿‍♂️", "🚴🏿‍♂", "🚴‍♀️", "🚴‍♀", "🚴🏻‍♀️", "🚴🏻‍♀",
	"🚴🏼‍♀️", "🚴🏼‍♀", "🚴🏽‍♀️", "🚴🏽‍♀", "🚴🏾‍♀️", "🚴🏾‍♀", "🚴🏿‍♀️", "🚴🏿‍♀", "🚵", "🚵🏻", "🚵🏼", "🚵🏽", "🚵🏾",
	"🚵🏿", "🚵‍♂️", "🚵‍♂", "🚵🏻‍♂️", "🚵🏻‍♂", "🚵🏼‍♂️", "🚵🏼‍♂", "🚵🏽‍♂️", "🚵🏽‍♂", "🚵🏾‍♂️", "🚵🏾‍♂", "🚵🏿‍♂️", "🚵🏿‍♂",
	"🚵‍♀️", "🚵‍♀", "🚵🏻‍♀️", "🚵🏻‍♀", "🚵🏼‍♀️", "🚵🏼‍♀", "🚵🏽‍♀️", "🚵🏽‍♀", "🚵🏾‍♀️", "🚵🏾‍♀", "🚵🏿‍♀️", "🚵🏿‍♀", "🤸",
	"🤸🏻", "🤸🏼", "🤸🏽", "🤸🏾", "🤸🏿", "🤸‍♂️", "🤸‍♂", "🤸🏻‍♂️", "🤸🏻‍♂", "🤸🏼‍♂️", "🤸🏼‍♂", "🤸🏽‍♂️", "🤸🏽‍♂",
	"🤸🏾‍♂️", "🤸🏾‍♂", "🤸🏿‍♂️", "🤸🏿‍♂", "🤸‍♀️", "🤸‍♀", "🤸🏻‍♀️", "🤸🏻‍♀", "🤸🏼‍♀️", "🤸🏼‍♀", "🤸🏽‍♀️", "🤸🏽‍♀", "🤸🏾‍♀️",
	"🤸🏾‍♀", "🤸🏿‍♀️", "🤸🏿‍♀", "🤼", "🤼‍♂️", "🤼‍♂", "🤼‍♀️", "🤼‍♀", "🤽", "🤽🏻", "🤽🏼", "🤽🏽", "🤽🏾",
	"🤽🏿", "🤽‍♂️", "🤽‍♂", "🤽🏻‍♂️", "🤽🏻‍♂", "🤽🏼‍♂️", "🤽🏼‍♂", "🤽🏽‍♂️", "🤽🏽‍♂", "🤽🏾‍♂️", "🤽🏾‍♂", "🤽🏿‍♂️", "🤽🏿‍♂",
	"🤽‍♀️", "🤽‍♀", "🤽🏻‍♀️", "🤽🏻‍♀", "🤽🏼‍♀️", "🤽🏼‍♀", "🤽🏽‍♀️", "🤽🏽‍♀", "🤽🏾‍♀️", "🤽🏾‍♀", "🤽🏿‍♀️", "🤽🏿‍♀", "🤾",
	"🤾🏻", "🤾🏼", "🤾🏽", "🤾🏾", "🤾🏿", "🤾‍♂️", "🤾‍♂", "🤾🏻‍♂️", "🤾🏻‍♂", "🤾🏼‍♂️", "🤾🏼‍♂", "🤾🏽‍♂️", "🤾🏽‍♂",
	"🤾🏾‍♂️", "🤾🏾‍♂", "🤾🏿‍♂️", "🤾🏿‍♂", "🤾‍♀️", "🤾‍♀", "🤾🏻‍♀️", "🤾🏻‍♀", "🤾🏼‍♀️", "🤾🏼‍♀", "🤾🏽‍♀️", "🤾🏽‍♀", "🤾🏾‍♀️",
	"🤾🏾‍♀", "🤾🏿‍♀️", "🤾🏿‍♀", "🤹", "🤹🏻", "🤹🏼", "🤹🏽", "🤹🏾", "🤹🏿", "🤹‍♂️", "🤹‍♂", "🤹🏻‍♂️", "🤹🏻‍♂",
	"🤹🏼‍♂️", "🤹🏼‍♂", "🤹🏽‍♂️", "🤹🏽‍♂", "🤹🏾‍♂️", "🤹🏾‍♂", "🤹🏿‍♂️", "🤹🏿‍♂", "🤹‍♀️", "🤹‍♀", "🤹🏻‍♀️", "🤹🏻‍♀", "🤹🏼‍♀️",
	"🤹🏼‍♀", "🤹🏽‍♀️", "🤹🏽‍♀", "🤹🏾‍♀️", "🤹🏾‍♀", "🤹🏿‍♀️", "🤹🏿‍♀", "🧘", "🧘🏻", "🧘🏼", "🧘🏽", "🧘🏾", "🧘🏿",
	"🧘‍♂️", "🧘‍♂", "🧘🏻‍♂️", "🧘🏻‍♂", "🧘🏼‍♂️", "🧘🏼‍♂", "🧘🏽‍♂️", "🧘🏽‍♂", "🧘🏾‍♂️", "🧘🏾‍♂", "🧘🏿‍♂️", "🧘🏿‍♂", "🧘‍♀️",
	"🧘‍♀", "🧘🏻‍♀️", "🧘🏻‍♀", "🧘🏼‍♀️", "🧘🏼‍♀", "🧘🏽‍♀️", "🧘🏽‍♀", "🧘🏾‍♀️", "🧘🏾‍♀", "🧘🏿‍♀️", "🧘🏿‍♀", "🛀", "🛀🏻",
	"🛀🏼", "🛀🏽", "🛀🏾", "🛀🏿", "🛌", "🛌🏻", "🛌🏼", "🛌🏽", "🛌🏾", "🛌🏿", "🧑‍🤝‍🧑", "🧑🏻‍🤝‍🧑🏻", "🧑🏻‍🤝‍🧑🏼",
	"🧑🏻‍🤝‍🧑🏽", "🧑🏻‍🤝‍🧑🏾", "🧑🏻‍🤝‍🧑🏿", "🧑🏼‍🤝‍🧑🏻", "🧑🏼‍🤝‍🧑🏼", "🧑🏼‍🤝‍🧑🏽", "🧑🏼‍🤝‍🧑🏾", "🧑🏼‍🤝‍🧑🏿", "🧑🏽‍🤝‍🧑🏻", "🧑🏽‍🤝‍🧑🏼", "🧑🏽‍🤝‍🧑🏽", "🧑🏽‍🤝‍🧑🏾", "🧑🏽‍🤝‍🧑🏿",
	"🧑🏾‍🤝‍🧑🏻", "🧑🏾‍🤝‍🧑🏼", "🧑🏾‍🤝‍🧑🏽", "🧑🏾‍🤝‍🧑🏾", "🧑🏾‍🤝‍🧑🏿", "🧑🏿‍🤝‍🧑🏻", "🧑🏿‍🤝‍🧑🏼", "🧑🏿‍🤝‍🧑🏽", "🧑🏿‍🤝‍🧑🏾", "🧑🏿‍🤝‍🧑🏿", "👭", "👭🏻", "👩🏻‍🤝‍👩🏼",
	"👩🏻‍🤝‍👩🏽", "👩🏻‍🤝‍👩🏾", "👩🏻‍🤝‍👩🏿", "👩🏼‍🤝‍👩🏻", "👭🏼", "👩🏼‍🤝‍👩🏽", "👩🏼‍🤝‍👩🏾", "👩🏼‍🤝‍👩🏿", "👩🏽‍🤝‍👩🏻", "👩🏽‍🤝‍👩🏼", "👭🏽", "👩🏽‍🤝‍👩🏾", "👩🏽‍🤝‍👩🏿",
	"👩🏾‍🤝‍👩🏻", "👩🏾‍🤝‍👩🏼", "👩🏾‍🤝‍👩🏽", "👭🏾", "👩🏾‍🤝‍👩🏿", "👩🏿‍🤝‍👩🏻", "👩🏿‍🤝‍👩🏼", "👩🏿‍🤝‍👩🏽", "👩🏿‍🤝‍👩🏾", "👭🏿", "👫", "👫🏻", "👩🏻‍🤝‍👨🏼",
	"👩🏻‍🤝‍👨🏽", "👩🏻‍🤝‍👨🏾", "👩🏻‍🤝‍👨🏿", "👩🏼‍🤝‍👨🏻", "👫🏼", "👩🏼‍🤝‍👨🏽", "👩🏼‍🤝‍👨🏾", "👩🏼‍🤝‍👨🏿", "👩🏽‍🤝‍👨🏻", "👩🏽‍🤝‍👨🏼", "👫🏽", "👩🏽‍🤝‍👨🏾", "👩🏽‍🤝‍👨🏿",
	"👩🏾‍🤝‍👨🏻", "👩🏾‍🤝‍👨🏼", "👩🏾‍🤝‍👨🏽", "👫🏾", "👩🏾‍🤝‍👨🏿", "👩🏿‍🤝‍👨🏻", "👩🏿‍🤝‍👨🏼", "👩🏿‍🤝‍👨🏽", "👩🏿‍🤝‍👨🏾", "👫🏿", "👬", "👬🏻", "👨🏻‍🤝‍👨🏼",
	"👨🏻‍🤝‍👨🏽", "👨🏻‍🤝‍👨🏾", "👨🏻‍🤝‍👨🏿", "👨🏼‍🤝‍👨🏻", "👬🏼", "👨🏼‍🤝‍👨🏽", "👨🏼‍🤝‍👨🏾", "👨🏼‍🤝‍👨🏿", "👨🏽‍🤝‍👨🏻", "👨🏽‍🤝‍👨🏼", "👬🏽", "👨🏽‍🤝‍👨🏾", "👨🏽‍🤝‍👨🏿",
	"👨🏾‍🤝‍👨🏻", "👨🏾‍🤝‍👨🏼", "👨🏾‍🤝‍👨🏽", "👬🏾", "👨🏾‍🤝‍👨🏿", "👨🏿‍🤝‍👨🏻", "👨🏿‍🤝‍👨🏼", "👨🏿‍🤝‍👨🏽", "👨🏿‍🤝‍👨🏾", "👬🏿", "💏", "👩‍❤️‍💋‍👨", "👩‍❤‍💋‍👨",
	"👨‍❤️‍💋‍👨", "👨‍❤‍💋‍👨", "👩‍❤️‍💋‍👩", "👩‍❤‍💋‍👩", "💑", "👩‍❤️‍👨", "👩‍❤‍👨", "👨‍❤️‍👨", "👨‍❤‍👨", "👩‍❤️‍👩", "👩‍❤‍👩", "👪", "👨‍👩‍👦",
	"👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦",
	"👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", "🗣",
	"👤", "👥", "👣", "🦰", "🦱", "🦳", "🦲", "🐵", "🐒", "🦍", "🦧", "🐶", "🐕",
	"🦮", "🐕‍🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🦁", "🐯", "🐅", "🐆", "🐴",
	"🐎", "🦄", "🦓", "🦌", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏",
	"🐑", "🐐", "🐪", "🐫", "🦙", "🦒", "🐘", "🦣", "🦏", "🦛", "🐭", "🐁", "🐀",
	"🐹", "🐰", "🐇", "🐿️", "🦔", "🦇", "🐻", "🐨", "🐼", "🦥", "🦦", "🦨", "🦘",
	"🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆",
	"🦢", "🦉", "🦩", "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕",
	"🦖", "🐳", "🐋", "🐬", "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🐌", "🦋", "🐛",
	"🐜", "🐝", "🐞", "🦗", "🕷️", "🕷", "🕸️", "🕸", "🦂", "🦟", "🦠", "💐", "🌸",
	"💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🌲", "🌳", "🌴", "🌵",
	"🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌",
	"🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆",
	"🥔", "🥕", "🌽", "🌶️", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞",
	"🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟",
	"🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗",
	"🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢",
	"🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪",
	"🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮",
	"🍯", "🍼", "🥛", "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂",
	"🥃", "🥤", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍽", "🍴", "🥄", "🔪", "🏺", "🌍",
	"🌎", "🌏", "🌐", "🗺️", "🗾", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️",
	"🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤",
	"🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽",
	"⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅",
	"🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅",
	"🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑",
	"🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🏎️", "🏍️",
	"🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🚏", "🛣️", "🛤️", "🛢️", "⛽", "🚨",
	"🚥", "🚦", "🛑", "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️",
	"🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🛎️",
	"🧳", "⌛", "⏳", "⌚", "⏰", "⏱️", "⏱", "⏲️", "⏲", "🕰️", "🕛", "🕧", "🕐",
	"🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢",
	"🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "🌑", "🌒", "🌓", "🌔", "🌕",
	"🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "🌡️", "🌡", "☀️", "🌝", "🌞", "🪐",
	"⭐", "🌟", "🌠", "🌌", "☁️", "⛅", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️",
	"🌪️", "🌫️", "🌫", "🌬️", "🌬", "🌀", "🌈", "🌂", "☂️", "☔", "⛱️", "⚡", "❄️",
	"☃️", "⛄", "☄️", "🔥", "💧", "🌊", "🎃", "🎄", "🎆", "🎇", "🧨", "✨", "🎈",
	"🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️", "🎗",
	"🎟️", "🎟", "🎫", "🎖️", "🎖", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "⚾", "🥎",
	"🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸",
	"🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀",
	"🪁", "🎱", "🔮", "🧿", "🎮", "🕹️", "🕹", "🎰", "🎲", "🧩", "🧸", "♠️", "♥",
	"♦️", "♣", "♟️", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🧵", "🧶", "👓", "🕶️",
	"🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻",
	"🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "👞", "👟", "🥾",
	"🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "🪖", "⛑️", "⛑",
	"📿", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕",
	"🎼", "🎵", "🎶", "🎙️", "🎚️", "🎛️", "🎤", "🎧", "📻", "🎷", "🎸", "🎹", "🎺",
	"🎻", "🪕", "🥁", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥️",
	"🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞️", "📽️", "🎬",
	"📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯️", "💡", "🔦", "🏮", "🪔", "📔",
	"📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️",
	"📑", "🔖", "🏷️", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "💹", "✉️",
	"📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️",
	"✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️",
	"🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️",
	"🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️",
	"🛠️", "🗡️", "⚔️", "🔫", "🏹", "🛡️", "🔧", "🔩", "⚙️", "🗜️", "⚖️", "🦯", "🔗",
	"⛓️", "🧰", "🧲", "⚗️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊",
	"🩹", "🩺", "🚪", "🛏️", "🛋️", "🪑", "🚽", "🚿", "🛁", "🪒", "🧴", "🧷", "🧹",
	"🧺", "🧻", "🧼", "🧽", "🧯", "🛒", "🚬", "⚰️", "⚱️", "🗿", "🏧", "🚮", "🚰",
	"♿", "🚹", "🚺", "🚻", "🚼", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔",
	"🚫", "🚳", "🚭", "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️",
	"↘️", "⬇️", "↙️", "⬅️", "↖️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚",
	"🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️",
	"🕎", "🔯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒",
	"♓", "⛎", "🔀", "🔁", "🔂", "▶️", "⏩", "⏭️", "⏭", "⏯️", "⏯", "◀️", "⏪",
	"⏮️", "⏮", "🔼", "⏫", "🔽", "⏬", "⏸️", "⏸", "⏹️", "⏹", "⏺️", "⏺", "⏏️",
	"🎦", "🔅", "🔆", "📶", "📳", "📴", "♀️", "♂️", "⚧️", "✖️", "➕", "➖", "➗",
	"♾️", "♾", "‼️", "⁉️", "❓", "❔", "❕", "❗", "〰️", "💱", "💲", "⚕️", "♻️",
	"⚜️", "🔱", "📛", "🔰", "⭕", "✅", "☑️", "✔️", "❌", "❎", "➰", "➿", "〽️",
	"✳️", "✴️", "❇️", "©️", "®️", "™️", "#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣",
	"5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🅰️", "🅰",
	"🆎", "🅱️", "🅱", "🆑", "🆒", "🆓", "🆔", "Ⓜ️", "🆕", "🆖", "🅾️", "🅾", "🆗",
	"🅿️", "🅿", "🆘", "🆙", "🆚", "🈁", "🈂️", "🈷️", "🈶", "🈯", "🉐", "🈹", "🈚",
	"🈲", "🉑", "🈸", "🈴", "🈳", "㊗️", "㊙️", "🈺", "🈵", "🔴", "🟠", "🟡", "🟢",
	"🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛",
	"⬜", "◼️", "◼", "◻️", "◻", "◾", "◽", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹",
	"🔺", "🔻", "💠", "🔘", "🔳", "🔲", "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏴‍☠️"
]

const randomEmoji = (): string => {
	return emojis[Math.floor(Math.random() * emojis.length)];
}

const randomColor = (): string => {
	return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

export default SocialCursorCollection;