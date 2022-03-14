import { 
	BuySuccess, 
	SocialClaimSuccess,
	Withdrawal,
	ResetPrice,
	SelledCountUpdate,
	URI,
	TransferSingle,
	TransferBatch,
} from '../generated/entities/Web3Sword/Web3Sword';

import { SwordBlockTimeLine } from '../generated/entities/schema';
import * as base64 from 'as-crypto/lib/base64';
import { Bytes, json } from '@graphprotocol/graph-ts';
import { format } from '../helper';
import { buildSwordBlock, getMinted } from '../s';
import { calculateEarn } from '../earn';

export function handleBuySuccess(event: BuySuccess): void {
	let sb = buildSwordBlock(event.params.tokenId.toString());
	sb.ownerId = event.params.buyer;
	sb.save();

	// 计算奖励分成
	calculateEarn(event.params.value, event.transaction.hash.toHexString(), event.block.timestamp);

	let minted = getMinted()
	minted.sbs.push(sb.id);
	minted.save();
}

export function handleSocialClaimSuccess(event: SocialClaimSuccess): void {
	let sb = buildSwordBlock(event.params.tokenId.toString());
	sb.ownerId = event.params.claimer;
	sb.save();

	let minted = getMinted()
	minted.sbs.push(sb.id);
	minted.save();
}

export function handleSelledCountUpdate(event: SelledCountUpdate): void {
	
}

export function handleTransferSingle(event: TransferSingle): void {
	let sb = buildSwordBlock(event.params.id.toString());
	sb.ownerId = event.params.to;
	sb.save();
}

export function handleTransferBatch(event: TransferBatch): void {
	let ids = event.params.ids;
	for (let i = 0; i < ids.length; i++) {
		let sb = buildSwordBlock(ids[i].toString());
		sb.ownerId = event.params.to;
		sb.save();
	}
}

export function handleURI(event: URI): void {
	const tokenId = event.params.id;
	const tokenURI = event.params.value;
	let s = tokenURI.replace("data:application/json;base64,", "");
	let b = base64.decode(s);
	let object = json.fromBytes(Bytes.fromUint8Array(b)).toObject();
	let iu = '';
	let imgurl = object.get('image_url');
	if (imgurl) {
		iu = imgurl.toString();
	}
	let sl = new SwordBlockTimeLine(format("{}{}", [event.block.timestamp.toString(), tokenId.toString()]));
	sl.tokenId = tokenId.toString();
	sl.imgURL = iu;
	sl.save();
}

export function handleWithdrawal(event: Withdrawal): void {
}

export function handleResetPrice(event: ResetPrice): void {

}