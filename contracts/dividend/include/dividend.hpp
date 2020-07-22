#include <utils.hpp>

using namespace eosio;

CONTRACT dividend : public contract
{
public:
   using contract::contract;

   static constexpr name STAKING_CONTRACT{"defistakedfs"_n};
   static constexpr name DFS_CONTRACT{"minedfstoken"_n};

   static constexpr uint32_t DIVIDEND_GAP = 1 * 86400;   

   dividend(name receiver, name code, datastream<const char *> ds)
       : contract(receiver, code, ds),
         _divds(_self, _self.value),
         _claims(_self, _self.value)
   {
     
   }

   ACTION exec(symbol_code sym);

   ACTION claim(name user, symbol_code sym);

   ACTION update(name user, asset quantity);

private:
   TABLE dividends
   {
      symbol sym;
      name contract;
      double reward_per_dfs;
      time_point_sec next_dividend;

      uint64_t primary_key() const { return sym.code().raw(); }
   };

   TABLE claim_st
   {
      name user;
      asset amount;
      time_point_sec next_dividend;

      uint64_t primary_key() const { return user.value; }
   };

   struct stake_st
   {
      name owner;
      asset bal;

      uint64_t primary_key() const { return owner.value; }
   };

   typedef multi_index<"divds"_n, dividends> divds;
   divds _divds;

   typedef multi_index<"claims"_n, claim_st> claims;
   claims _claims;

   typedef multi_index<"stakes"_n, stake_st> stakes;
};