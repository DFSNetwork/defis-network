#include <utils.hpp>

CONTRACT factory : public contract
{
public:
   using contract::contract;

   factory(name receiver, name code, datastream<const char *> ds)
       : contract(receiver, code, ds),
         _pairs(_self, _self.value),
         _globals(_self, _self.value) {}

   ACTION mapping(uint64_t mid);

   [[eosio::on_notify("minedfstoken::transfer")]] 
   void create(name from, name to, asset quantity, std::string memo);

private:
   TABLE pair
   {
      checksum256 digest;
      std::string unikey;
      uint64_t mid;

      uint64_t primary_key() const { return utils::uint64_hash(digest); }
      uint64_t byid() const { return mid; }
   };

   TABLE globals
   {
      uint64_t market_id;
      EOSLIB_SERIALIZE(globals, (market_id))
   };

   typedef multi_index<"pairs"_n, pair, indexed_by<"byid"_n, const_mem_fun<pair, uint64_t, &pair::byid>>> pairs;
   pairs _pairs;

   typedef eosio::singleton<"globals"_n, globals> globals_index;
   globals_index _globals;

   uint64_t get_mid();
   void create_market(uint64_t mid, name creator, name contract0, name contract1, symbol sym0, symbol sym1);
};