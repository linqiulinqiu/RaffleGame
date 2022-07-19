import {
    ethers
} from 'ethers'

import pbwallet from 'pbwallet'
// 全局变量设置
var bsc = {}
const ptAddrs = {
    'BNB': ethers.constants.AddressZero,
    // "USDT": bsc.ctrs.usdt.address
}


async function connect(commit,provider) {
    try {
        bsc = await pbwallet.connect(provider, true)
        console.log("bsc in js",bsc)
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


export default {
    connect: connect,
    waitEventDone:waitEventDone
}