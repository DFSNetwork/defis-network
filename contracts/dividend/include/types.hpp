#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

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

struct account
{
    asset balance;

    uint64_t primary_key() const { return balance.symbol.code().raw(); }
};

struct stake_st
{
    name owner;
    asset bal;

    uint64_t primary_key() const { return owner.value; }
};

typedef eosio::multi_index<"accounts"_n, account> accounts;
typedef eosio::multi_index<"stat"_n, currency_stats> stats;
typedef multi_index<"stakes"_n, stake_st> stakes;