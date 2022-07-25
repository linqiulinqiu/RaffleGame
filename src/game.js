import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
// 全局变量设置
var bsc = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
}

async function recent_bonus_list(bsc){
    const blockLimit = 500  // for some RPC endpoints, it is limited to 500 for main-net and 5000 for test-net; 
    const currentBlock = await bsc.provider.getBlockNumber()
    const hg = bsc.ctrs.holdgame
    const evts = await hg.queryFilter(hg.filters.WinBonus, currentBlock-blockLimit)
    const wins = []
    console.log('events')
    for(let i in evts){
        const arg = evts[i].args
        if(evts[i].event =='TicketsBought'){
            console.log('\ttickets-bought: buyer', arg.buyer, 'count', arg.count.toNumber(), 'from-index', arg.from.toNumber())
        }else if(evts[i].event =='WinBonus'){
            console.log('\twin-bonus: winner', arg.winner, 'amount', ethers.utils.formatEther(arg.amount), 'stage', arg.stageIdx.toNumber(),
                'ticket-index', arg.ticketIdx.toNumber())
            wins.push({
                winner: arg.winner,
                amount: arg.amount,
                stage: arg.stageIdx.toNumber(),
                tidx: arg.ticketIdx.toNumber()
            })
        }
    }
    return wins
}

async function connect(commit,provider) {
    try {
        bsc = await pbwallet.connect(provider, true)
        console.log("bsc in js",bsc)
        const bonuslist = await recent_bonus_list(bsc)
        console.log('wins', bonuslist)
    } catch (e) {
        return e.message
    }
    if (bsc) {
        commit("setBsc", bsc)
        return bsc
    }
    return false
}

async function waitEventDone(tx, done) {
    bsc.provider.once(tx.hash, function (evt) {
        done(tx, evt)
    })
}

async function listenEvents() {
    
}


export default {
    connect: connect,
    waitEventDone:waitEventDone
}
