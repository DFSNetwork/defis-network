#include <family.hpp>

void family::join(name from, name to, asset quantity, std::string memo)
{
   if (from == _self || to != _self)
      return;

   if (memo == "join")
   {
      check(quantity.amount == 100 * 10000, "pay 100 DFS to join");
      create(from);
   }
   else if (memo == "stake")
   {
      check(quantity.amount == 5000 * 10000, "stake 5000 DFS to join");
      create(from);
      
      _stakes.emplace(get_self(), [&](auto &s) {
         s.owner = from;
         s.bal = quantity;
      });
   }
   else
   {
      check(false, "invalid memo");
   }
}

ACTION family::unstake(name user)
{
   require_auth(user);
   auto itr = _stakes.require_find(user.value, "stake not found");
   asset quantity = itr->bal;
   _stakes.erase(itr);
   auto index = _codes.get_index<name("byname")>();
   auto code_itr = index.require_find(user.value, "code not found");
   index.erase(code_itr);
   action{permission_level{get_self(), "active"_n}, name("minedfstoken"), "transfer"_n,
          make_tuple(get_self(), user, quantity, std::string("stake refund"))}
       .send();
}

uint64_t family::get_id()
{
   globals glb = _globals.get_or_default(globals{});
   glb.id += 1;
   _globals.set(glb, _self);
   return glb.id;
}

void family::create(name from)
{
   auto index = _codes.get_index<name("byname")>();
   auto itr = index.find(from.value);

   check(itr == index.end(), "You're in the DFS family already.");

   _codes.emplace(get_self(), [&](auto &s) {
      s.id = get_id();
      s.owner = from;
   });
}