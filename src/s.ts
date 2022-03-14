import { Minted, SwordBlock } from './generated/entities/schema';
import { BigInt } from '@graphprotocol/graph-ts';

export function getMinted(): Minted {
    let minted = Minted.load('0');
    if (minted == null) {
        minted = new Minted('0');
        minted.sbs = [];
        minted.save();
    }
    return minted;
}

export function buildSwordBlock(tokenId: string): SwordBlock {
    let sb = SwordBlock.load(tokenId);
    if (sb == null) {
        sb = new SwordBlock(tokenId);
        sb.tokenId = tokenId;
        sb.imgURL = '';
        sb.save();
    }
    return sb;
}