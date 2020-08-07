uint64_t mining_origin_capital = 0;
if (m_itr->liq_bal0.symbol == symbol("EOS", 4))
    mining_origin_capital = m_itr->liq_bal0.amount;
if (m_itr->liq_bal1.symbol == symbol("EOS", 4))
    mining_origin_capital = m_itr->liq_bal1.amount;
if (mining_origin_capital == 0)
    return;

uint64_t mining_reward_amount = 0;
uint32_t time_elapsed = 0;
if (m_itr->last_drip.sec_since_epoch() < arg_itr->last_drip.sec_since_epoch())
{
    time_elapsed = current_time_point().sec_since_epoch() - arg_itr->last_drip.sec_since_epoch();
    uint64_t mining_total = mining_origin_capital * arg_itr->aprs_accumulator * pow(arg_itr->aprs, time_elapsed);
    check(mining_total >= mining_origin_capital, "pools claim: mining math error");
    mining_reward_amount = mining_total - mining_origin_capital;
}
else
{
    time_elapsed = current_time_point().sec_since_epoch() - m_itr->last_drip.sec_since_epoch();
    uint64_t mining_total = mining_origin_capital * pow(arg_itr->aprs, time_elapsed);
    check(mining_total >= mining_origin_capital, "pools claim: mining math error");
    mining_reward_amount = mining_total - mining_origin_capital;
}

liquidity_mining_reward =  (liquidity * pow(apr_s, time_elapsed) - liquidity) / dfs_price * damping * pool_weight;


damping = pow(0.75, (int)(current_supply / 1000000));



// DFS价格
double pools::get_dfs_price()
{
    avgprices _avgprices(ORACLE_ACCOUNT, mid_of_dfs);
    const auto &pricedata = _avgprices.get(dfs_price_period);
    
    
    auto price = pricedata.price1_avg_price;

    // 暂定0.1EOS 为DFS价格下限保护。价格往上走，无操控获利空间。暂时不处理上限保护。
    if (price < 1000)
    {
        action(permission_level{get_self(), "active"_n}, name("dfsexception"), name("onexception"),
               std::make_tuple(string("mining pools: dfs price price_lower_bound protection"), price))
            .send();
        return 0;
    }

