uint64_t swap::get_amount_out(uint64_t amount_in, uint64_t reserve_in, uint64_t reserve_out)
{
    check(amount_in > 0, "invalid input amount");
    check(reserve_in > 0 && reserve_out > 0, "insufficient liquidity");
    uint128_t amount_in_with_fee = (uint128_t)amount_in * (10000 - TRADE_FEE);
    uint128_t numerator = amount_in_with_fee * (uint128_t)reserve_out;
    uint128_t denominator = (uint128_t)reserve_in * 10000 + amount_in_with_fee;
    uint64_t amount_out = (uint64_t)(numerator / denominator);
    check(amount_out > 0, "invalid output amount");
    return amount_out;
}

extended_asset swap::do_swap(uint64_t mid, name from, asset quantity, name code, std::string memo)
{
    auto m_itr = _markets.require_find(mid, "Market does not exist.");
    check((code == m_itr->contract0 || code == m_itr->contract1), "contract error");
    check((quantity.symbol == m_itr->sym0 || quantity.symbol == m_itr->sym1), "symbol error");
    check((code == m_itr->contract0 && quantity.symbol == m_itr->sym0) || (code == m_itr->contract1 && quantity.symbol == m_itr->sym1), "market error"); // security warning from PeckShield
    uint64_t amount_in = quantity.amount;
    uint64_t tmp = safemath::mul(amount_in, PROTOCOL_FEE);
    uint64_t protocol_fee = tmp / 10000;
    if (protocol_fee > 0)
    {
        amount_in = safemath::sub(amount_in, protocol_fee);
        utils::inline_transfer(code, get_self(), PROTOCOL_FEE_ACCOUNT, asset(protocol_fee, quantity.symbol), std::string("swap protocol fee"));
    }
    uint64_t reserve0 = m_itr->reserve0.amount;
    uint64_t reserve1 = m_itr->reserve1.amount;
    uint64_t amount_out = 0;
    asset quantity_out;
    extended_asset quantity_out_ex;
    if (code == m_itr->contract0 && quantity.symbol == m_itr->sym0)
    {
        amount_out = get_amount_out(amount_in, reserve0, reserve1);
        check(amount_out < reserve1, "invalid amount_out1");
        quantity_out = asset(amount_out, m_itr->sym1);
        quantity_out_ex = extended_asset(quantity_out, m_itr->contract1);
        uint64_t bal0 = safemath::add(reserve0, amount_in);
        uint64_t bal1 = safemath::sub(reserve1, amount_out);
        update(mid, bal0, bal1, reserve0, reserve1);
    }
    else
    {
        amount_out = get_amount_out(amount_in, reserve1, reserve0);
        check(amount_out < reserve0, "invalid amount_out0");
        quantity_out = asset(amount_out, m_itr->sym0);
        quantity_out_ex = extended_asset(quantity_out, m_itr->contract0);
        uint64_t bal0 = safemath::sub(reserve0, amount_out);
        uint64_t bal1 = safemath::add(reserve1, amount_in);
        update(mid, bal0, bal1, reserve0, reserve1);
    }
    // event log
    action(permission_level{get_self(), "active"_n}, LOG_ACCOUNT, name("swaplog"),
           std::make_tuple(from, mid, quantity, quantity_out, memo))
        .send();
    return quantity_out_ex;
}