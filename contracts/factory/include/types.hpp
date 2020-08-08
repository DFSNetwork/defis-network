#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
#include <eosio/crypto.hpp>

using namespace eosio;

struct transfer_args
{
    name from;
    name to;
    asset quantity;
    std::string memo;
};

struct currency_stats
{
    asset supply;
    asset max_supply;
    name issuer;

    uint64_t primary_key() const { return supply.symbol.code().raw(); }
};
typedef eosio::multi_index<"stat"_n, currency_stats> stats;

struct market
{
    uint64_t mid;

    name contract0;
    name contract1;
    symbol sym0;
    symbol sym1;
    asset reserve0;
    asset reserve1;
    uint64_t liquidity_token;
    double price0_last; // the last price is easy to controll, just for kline display, don't use in other dapp directly
    double price1_last;
    uint64_t price0_cumulative_last;
    uint64_t price1_cumulative_last;
    time_point_sec last_update;

    uint64_t primary_key() const { return mid; }
};
typedef multi_index<"markets"_n, market> markets;
