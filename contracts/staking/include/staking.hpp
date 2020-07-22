#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>

using namespace eosio;

CONTRACT staking : public contract
{
public:
   using contract::contract;

   static constexpr symbol dfs_symbol = symbol("DFS", 4);

   static constexpr uint32_t seconds_per_day = 1;
   static constexpr uint32_t refund_delay_sec = 3 * seconds_per_day;

   staking(name receiver, name code, datastream<const char *> ds)
       : contract(receiver, code, ds),
         _stakes(_self, _self.value)
   {
   }

   ACTION unstake(name user, asset quantity);

   [[eosio::on_notify("minedfstoken::transfer")]] void stake(name from, name to, asset quantity, std::string memo);

   ACTION refund(name user, uint64_t id);

private:
   TABLE stake_st
   {
      name owner;
      asset bal;

      uint64_t primary_key() const { return owner.value; }
   };

   TABLE refund_st
   {
      uint64_t id;
      asset refund;
      time_point_sec request_time;
      uint64_t primary_key() const { return id; }
   };

   typedef multi_index<"stakes"_n, stake_st> stakes;
   stakes _stakes;

   typedef multi_index<"refunds"_n, refund_st> refunds;
};