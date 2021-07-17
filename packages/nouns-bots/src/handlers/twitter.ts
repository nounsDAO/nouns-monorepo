import { twitter } from "../clients";
import { config } from "../config";
import { getAuctionStartedTweetText, getNounPngBuffer } from "../utils";

export const processNewAuction = async (auctionId: number) => {
	if (!config.twitterEnabled) return;
	const png = await getNounPngBuffer(auctionId.toString());
	if (png) {
		console.log(`processLastAuction tweeting discovered auction id and noun`);
		const mediaId = await twitter.v1.uploadMedia(png, { type: 'png' });
		await twitter.v1.tweet(
			getAuctionStartedTweetText(auctionId),
			{
				media_ids: mediaId,
			},
		);
	}
}