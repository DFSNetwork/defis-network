#include <staking.hpp>
ACTION staking::unstake(name user, asset quantity)
{
   require_auth(user);

   auto itr = _stakes.require_find(user.value, "stake not found");
   check(quantity <= itr->bal, "invalid quantity");

   _stakes.modify(itr, same_payer, [&](auto &s) {
      s.bal -= quantity;
   });

   // refunds _refunds(get_self(), user.value);
   // _refunds.emplace(user, [&](auto &s) {
   //    s.id = _refunds.available_primary_key();
   //    s.refund = quantity;
   //    s.request_time = current_time_point();
   // });

   action{permission_level{get_self(), "active"_n}, name("minedfstoken"), "transfer"_n,
          make_tuple(get_self(), user, quantity, std::string("stake refund"))}
       .send();
}

ACTION staking::refund(name user, uint64_t id)
{
   // require_auth(user);

   refunds _refunds(get_self(), user.value);

   auto req = _refunds.require_find(id, "refund request not found");

   check(req->request_time + seconds(refund_delay_sec) <= current_time_point(),
         "refund is not available yet");

   action{permission_level{get_self(), "active"_n}, name("minedfstoken"), "transfer"_n,
          make_tuple(get_self(), user, req->refund, std::string("stake refund"))}
       .send();

   _refunds.erase(req);
}

void staking::stake(name from, name to, asset quantity, std::string memo)
{
   if (from == _self || to != _self)
      return;

   auto itr = _stakes.find(from.value);

   if (itr != _stakes.end())
   {
      _stakes.modify(itr, same_payer, [&](auto &s) {
         s.bal += quantity;
      });
   }
   else
   {
      _stakes.emplace(get_self(), [&](auto &s) {
         s.owner = from;
         s.bal = quantity;
      });
   }

   action{
       permission_level{get_self(), "active"_n},
       name("defidividend"),
       "update"_n,
       std::make_tuple(from, quantity)}
       .send();
}
