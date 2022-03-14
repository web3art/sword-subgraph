import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Earn, EarnLog } from './generated/entities/schema';
import { format } from './helper';
import { getMinted, buildSwordBlock } from './s';


function buildEarn(user: Address): Earn {
    let e = Earn.load(user.toHexString());
    if (e == null) {
        e = new Earn(user.toHexString());
        e.amount = BigInt.fromI32(0);
    }
    return e;
}

export function calculateEarn(price: BigInt, hash: string, timestamp: BigInt): void {
    let minted = getMinted();
    let sbs = minted.sbs;

    // 50%
    let everyoneEarn = price.times(BigInt.fromI32(50)).div(BigInt.fromI32(100)).mod(BigInt.fromI32(sbs.length));

    for (let i = 0; i < sbs.length; i++) {
        let sb = buildSwordBlock(sbs[i]);
        let earn = buildEarn(Address.fromString(sb.ownerId.toHexString()));
        earn.amount = earn.amount.plus(everyoneEarn);
        earn.save();

        let log = new EarnLog(format("{}#{}", [sb.ownerId.toHexString(), hash]));
        log.amount = everyoneEarn;
        log.earnedAt = timestamp;
        log.earnId = earn.id;
        log.tokenId = sb.tokenId;
        log.save();
    }
}