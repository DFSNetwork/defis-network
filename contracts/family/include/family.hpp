#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/system.hpp>
#include <eosio/singleton.hpp>
using namespace eosio;

CONTRACT family : public contract
{
public:
   using contract::contract;

   family(name receiver, name code, datastream<const char *> ds)
       : contract(receiver, code, ds),
         _codes(_self, _self.value),
         _stakes(_self, _self.value),
         _globals(_self, _self.value)
   {
   }

   [[eosio::on_notify("minedfstoken::transfer")]] 
   void join(name from, name to, asset quantity, std::string memo);

   ACTION unstake(name user);

private:
   TABLE code_st
   {
      uint64_t id;
      name owner;
      uint64_t primary_key() const { return id; }
      uint64_t byname() const { return owner.value; }
   };

   TABLE globals
   {
      uint64_t id;
   };

   TABLE stake_st
   {
      name owner;
      asset bal;

      uint64_t primary_key() const { return owner.value; }
   };

   typedef multi_index<"stakes"_n, stake_st> stakes;
   stakes _stakes;

   typedef eosio::singleton<"globals"_n, globals> globals_index;
   globals_index _globals;

   typedef multi_index<"codes"_n, code_st, indexed_by<"byname"_n, const_mem_fun<code_st, uint64_t, &code_st::byname>>> codes;
   codes _codes;

   uint64_t get_id();
   void create(name from);
};