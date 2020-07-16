#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;
using namespace std;

static constexpr symbol rex_symbol = symbol(symbol_code("REX"), 4);
static constexpr symbol ramcore_symbol = symbol(symbol_code("RAMCORE"), 4);
struct transfer_args
{
    name from;
    name to;
    asset quantity;
    string memo;
};

struct configs
{
    name vote_proxy;
    name price_oracle;
    uint64_t market_id;
    uint64_t price_period;
    uint64_t price_lower_bound;
    uint64_t price_upper_bound;
    uint64_t minimum_collateral_ratio;
    uint64_t minimum_deposit;
    uint64_t mint_fee;
};

typedef singleton<"configs"_n, configs> configs_index;

struct avgprice
{
    uint64_t key;
    name submitter;
    string period;
    uint64_t price0_cumulative_last;
    uint64_t price1_cumulative_last;
    double price0_avg_price;
    double price1_avg_price;
    time_point_sec last_update;

    uint64_t primary_key() const { return key; }
};

typedef multi_index<"avgprices"_n, avgprice> avgprices;

struct rex_balance
{
    uint8_t version = 0;
    name owner;
    asset vote_stake;
    asset rex_balance;
    int64_t matured_rex = 0;
    std::deque<std::pair<time_point_sec, int64_t>> rex_maturities; /// REX daily maturity buckets

    uint64_t primary_key() const { return owner.value; }
};

typedef eosio::multi_index<"rexbal"_n, rex_balance> rex_balance_table;
rex_balance_table _rexbalance(name("eosio"), name("eosio").value);

// system rammarket
struct exstate
{
    asset supply;

    struct connector
    {
        asset balance;
        double weight = .5;

        EOSLIB_SERIALIZE(connector, (balance)(weight))
    };

    connector base;
    connector quote;

    uint64_t primary_key() const { return supply.symbol.raw(); }

    EOSLIB_SERIALIZE(exstate, (supply)(base)(quote))
};

typedef eosio::multi_index<"rammarket"_n, exstate> rammarket;