#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
using namespace eosio;
using namespace std;

CONTRACT logs : public contract
{
public:
   using contract::contract;

   static constexpr name SWAP_ACCOUNT{"defisswapcnt"_n};

   // DeFis Swap logs
   ACTION swaplog(name user, uint64_t mid, asset amountIn, asset amountOut, string memo);
   ACTION depositlog(name user, uint64_t mid, asset quantity0, asset quantity1);
   ACTION withdrawlog(name user, uint64_t mid, uint64_t amount, asset quantity0, asset quantity1);
};