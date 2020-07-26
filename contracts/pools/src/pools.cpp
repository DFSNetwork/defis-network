#include <pools.hpp>

ACTION logs::mining(uint64_t mid, name from, extended_asset quantity_in_ex, extended_asset quantity_out_ex)
{
    require_auth(name("defisswapcnt"));

    asset eos_trade = asset(0, symbol("EOS", 4));
    if (quantity_out_ex.contract == name("eosio.token") && quantity_out_ex.quantity.symbol == symbol("EOS", 4))
    {
        eos_trade.amount = quantity_out_ex.quantity.amount;
    }
    if (quantity_in_ex.contract == name("eosio.token") && quantity_in_ex.quantity.symbol == symbol("EOS", 4))
    {
        eos_trade.amount = quantity_in_ex.quantity.amount;
    }
    if (eos_trade.amount >= 10000)
    {
        double pool_weight = 0;
        if (mid == 7) // USDD
        {
            pool_weight = 1;
        }
        else if (mid == 17) //USDT
        {
            pool_weight = 0.7;
        }
        else if (mid == 2 || mid == 3 || mid == 4 || mid == 5)
        {
            pool_weight = 0.3;
        }

        if (pool_weight > 0)
        {
            eos_trade.amount = eos_trade.amount * pool_weight;
            action(permission_level{get_self(), "active"_n}, name("minedfstoken"), name("mine"), std::make_tuple(from, eos_trade)).send();
        }
    }
}