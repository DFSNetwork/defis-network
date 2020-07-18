let markets = [{
    "mid": 1,
    "contract0": "eosio.token",
    "contract1": "tethertether",
    "sym0": "4,EOS",
    "sym1": "4,USDT",
    "reserve0": "795.5128 EOS",
    "reserve1": "3117.9301 USDT",
    "liquidity_token": 15744553,
    "price0_last": "3.90030000000000010",
    "price1_last": "0.25629999999999997",
    "price0_cumulative_last": 3952316795,
    "price1_cumulative_last": 386026205,
    "last_update": "2020-07-10T16:51:30"
}, {
    "mid": 2,
    "contract0": "eosio.token",
    "contract1": "vig111111111",
    "sym0": "4,EOS",
    "sym1": "4,VIG",
    "reserve0": "3021.4198 EOS",
    "reserve1": "8112.4886 VIG",
    "liquidity_token": 49506781,
    "price0_last": "2.68500000000000005",
    "price1_last": "0.37240000000000001",
    "price0_cumulative_last": 2277633544,
    "price1_cumulative_last": 312222703,
    "last_update": "2020-07-10T06:13:55"
}, {
    "mid": 3,
    "contract0": "eosio.token",
    "contract1": "newdexissuer",
    "sym0": "4,EOS",
    "sym1": "4,NDX",
    "reserve0": "1084.5102 EOS",
    "reserve1": "2506.3712 NDX",
    "liquidity_token": 16481750,
    "price0_last": "2.29829999999999979",
    "price1_last": "0.43500000000000000",
    "price0_cumulative_last": 2623031203,
    "price1_cumulative_last": 397033050,
    "last_update": "2020-07-10T11:07:01"
}, {
    "mid": 5,
    "contract0": "eosio.token",
    "contract1": "eosiotptoken",
    "sym0": "4,EOS",
    "sym1": "4,TPT",
    "reserve0": "2012.6940 EOS",
    "reserve1": "5413.6523 TPT",
    "liquidity_token": 33007854,
    "price0_last": "2.69260000000000010",
    "price1_last": "0.37130000000000002",
    "price0_cumulative_last": 83229859,
    "price1_cumulative_last": 11219542,
    "last_update": "2020-07-09T07:39:21"
}, {
    "mid": 7,
    "contract0": "eosio.token",
    "contract1": "everipediaiq",
    "sym0": "4,EOS",
    "sym1": "3,IQ",
    "reserve0": "1014.8313 EOS",
    "reserve1": "26735.695 IQ",
    "liquidity_token": 16471552,
    "price0_last": "2.64449999999999985",
    "price1_last": "0.37809999999999999",
    "price0_cumulative_last": 5895685,
    "price1_cumulative_last": 820849,
    "last_update": "2020-07-10T16:51:30"
}, {
    "mid": 9,
    "contract0": "newdexissuer",
    "contract1": "bgbgbgbgbgbg",
    "sym0": "4,NDX",
    "sym1": "4,BG",
    "reserve0": "27131.2040 NDX",
    "reserve1": "2731.2041 BG",
    "liquidity_token": 86081853,
    "price0_last": "0.00000000000000000",
    "price1_last": "0.00000000000000000",
    "price0_cumulative_last": 0,
    "price1_cumulative_last": 0,
    "last_update": "2020-07-11T02:36:32"
}, {
    "mid": 10,
    "contract0": "bgbgbgbgbgbg",
    "contract1": "mkstaketoken",
    "sym0": "4,BG",
    "sym1": "4,KEY",
    "reserve0": "27131.2040 BG",
    "reserve1": "2731.2041 KEY",
    "liquidity_token": 86081853,
    "price0_last": "0.00000000000000000",
    "price1_last": "0.00000000000000000",
    "price0_cumulative_last": 0,
    "price1_cumulative_last": 0,
    "last_update": "2020-07-11T02:36:36"
}
]

let pair_market_map = {};
let mid_market_map = {};
let tokens = [];
let paths = [];

markets.map(x => {
    let tokenA = x.contract0 + ":" + x.sym0.split(",")[1];
    let tokenB = x.contract1 + ":" + x.sym1.split(",")[1];

    let pair_a = tokenA + "-" + tokenB;
    let pair_b = tokenB + "-" + tokenA;

    pair_market_map[pair_a] = x;
    pair_market_map[pair_b] = x;

    mid_market_map[x.mid] = x;

    paths.push(pair_a);
    paths.push(pair_b);

    let new_paths = []

    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let tks = path.split("-");
        if (tks[0] === tokenA && tks[tks.length - 1] !== tokenB) {
            new_paths.push(tokenB + "-" + path)
        }

        if (tks[tks.length - 1] === tokenA && tks[0] !== tokenB) {
            new_paths.push(path + "-" + tokenB);
        }

        if (tks[0] === tokenB && tks[tks.length - 1] !== tokenA) {
            new_paths.push(tokenA + "-" + path)
        }

        if (tks[tks.length - 1] === tokenB && tks[0] !== tokenA) {
            new_paths.push(path + "-" + tokenA);
        }
    }

    paths = paths.concat(new_paths);

    if (tokens.indexOf(tokenA) === -1) {
        tokens.push(tokenA)
    }
    if (tokens.indexOf(tokenB) === -1) {
        tokens.push(tokenB)
    }
})

console.log("tokens", tokens);

paths = paths.sort((a, b) => {
    return a.length - b.length;
})

console.log("paths", paths);

function get_paths(tokenA, tokenB) {
    let pair = [tokenA, tokenB].sort().join("-");

    let market = pair_market_map[pair];

    let _paths;

    if (market) {
        _paths = pair;
    } else {
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let tks = path.split("-");
            if ((tks[0] === tokenA && tks[tks.length - 1] === tokenB)) {
                _paths = path;
                break;
            }
        }
    }
    let mids;

    let tks = _paths.split("-");

    for (let i = 0; i < tks.length - 1; i++) {
        let pair = tks[i] + "-" + tks[i + 1]
        if (!mids) {
            mids = pair_market_map[pair].mid;
        } else {
            mids = mids + "-" + pair_market_map[pair].mid;
        }
    }

    // 根据兑换路径, 找出对应的mid路径
    console.log(_paths, mids);

    return mids + "";
}


// 计算兑换路径
let mids1 = get_paths("eosio.token:EOS", "everipediaiq:IQ");  // 直接兑换    EOS-IQ
let mids2 = get_paths("eosiotptoken:TPT", "everipediaiq:IQ"); // 中转兑换1次 TPT-EOS-IQ
let mids3 = get_paths("eosio.token:EOS", "bgbgbgbgbgbg:BG");  // 中转兑换1次 EOS-NDX-BG
let mids4 = get_paths("eosio.token:EOS", "mkstaketoken:KEY"); // 中转兑换2次 EOS-NDX-BG-KEY


// 计算amount_out 
get_amounts_out(mids1, "eosio.token:EOS", 100000); // 10 EOS ->  260.104 IQ
get_amounts_out(mids2, "eosiotptoken:TPT", 100000);// 10 EOS -> 3.6999 EOS -> 96.828 IQ
get_amounts_out(mids3, "eosio.token:EOS", 100000); // 10 EOS -> 22.8315 NDX -> 2.2896 BG
get_amounts_out(mids4, "eosio.token:EOS", 100000); // 10 EOS -> 22.8315 NDX -> 2.2896 BG -> 0.2298 KEY


function get_amounts_out(mids, token_in, amount_in) {
    let mid_arr = mids.split("-");

    for (let i = 0; i < mid_arr.length; i++) {
        let mid = mid_arr[i];
        let swap_result = swap(mid, token_in, amount_in);
        
        amount_in = swap_result.amount_out;
        token_in = swap_result.token_out;
        quantity_out = swap_result.quantity_out;
    }

    console.log(amount_in, token_in, quantity_out);
}

function swap(mid, token_in, amount_in) {
    let market = mid_market_map[mid];

    let tokenA = market.contract0 + ":" + market.sym0.split(",")[1];
    let tokenB = market.contract1 + ":" + market.sym1.split(",")[1];

    amount_in -= amount_in * 0.001; // 协议费扣除
    let amount_out;
    let token_out;
    let quantity_out;

    if (token_in === tokenA) {
        let reserve_in = parseFloat(market.reserve0) * (10 ** market.sym0.split(",")[0]);
        let reserve_out = parseFloat(market.reserve1) * (10 ** market.sym1.split(",")[0]);
        amount_out = get_amount_out(amount_in, reserve_in, reserve_out);

        token_out = tokenB
        quantity_out = (amount_out / (10 ** market.sym1.split(",")[0])).toFixed(market.sym1.split(",")[0]) + " " + market.reserve1.split(" ")[1];
        console.log("quantity_out:", quantity_out);
    }
    if (token_in === tokenB) {
        let reserve_in = parseFloat(market.reserve1) * (10 ** market.sym1.split(",")[0]);
        let reserve_out = parseFloat(market.reserve0) * (10 ** market.sym0.split(",")[0]);
        amount_out = get_amount_out(amount_in, reserve_in, reserve_out);

        token_out = tokenA;
        quantity_out = (amount_out / (10 ** market.sym0.split(",")[0])).toFixed(market.sym0.split(",")[0]) + " " + market.reserve0.split(" ")[1];
        console.log("quantity_out:", quantity_out);
    }

    return {
        token_out,
        amount_out,
        quantity_out
    }
}

function get_amount_out(amount_in, reserve_in, reserve_out) {
    check(amount_in > 0, "invalid input amount");
    check(reserve_in > 0 && reserve_out > 0, "insufficient liquidity");

    let amount_in_with_fee = amount_in * (10000 - 20);
    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in * 10000 + amount_in_with_fee;
    let amount_out = numerator / denominator;

    check(amount_out > 0, "invalid output amount");
    return amount_out;
}

function check(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}