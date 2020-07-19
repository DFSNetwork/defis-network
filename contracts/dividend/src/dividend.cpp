#include <dividend.hpp>
ACTION dividend::exec(symbol_code sym)
{
   require_auth(get_self());

   auto itr_divds = _divds.find(sym.raw());

   if (itr_divds->next_dividend <= current_time_point())
   {
      asset reward_balance = utils::get_balance(itr_divds->contract, get_self(), sym);
      asset dfs_balance = utils::get_balance(DFS_CONTRACT, STAKING_CONTRACT, symbol_code("DFS"));

      asset team_reward = reward_balance / 2;
      reward_balance -= team_reward;

      if (team_reward.amount > 0)
      {
         action{permission_level{get_self(), "active"_n}, itr_divds->contract, "transfer"_n,
                std::make_tuple(get_self(), "difesteam222"_n, team_reward, std::string("team reward"))}
             .send();
      }

      double reward_per_dfs = reward_balance.amount;
      if (dfs_balance.amount == 0)
      {
         reward_per_dfs = 0;
      }
      else
      {
         reward_per_dfs /= dfs_balance.amount;
      }

      time_point_sec next{current_time_point().sec_since_epoch() + DIVIDEND_GAP};
      _divds.modify(itr_divds, same_payer, [&](auto &s) {
         s.next_dividend = next;
         s.reward_per_dfs = reward_per_dfs;
      });
   }
   else
   {
      print("It's not dividend time");
   }
}

ACTION dividend::upgrade()
{
   require_auth(get_self());

   auto itr_divds = _divds.begin();

   time_point_sec next{1595228400 + DIVIDEND_GAP};

   _divds.modify(itr_divds, same_payer, [&](auto &s) {
      s.next_dividend = next;
      s.reward_per_dfs = 0;
   });
}

ACTION dividend::claim(name user, symbol_code sym)
{
   auto itr_divds = _divds.require_find(sym.raw(), "nothing can claim");

   stakes _stakes(STAKING_CONTRACT, STAKING_CONTRACT.value);
   auto stake_itr = _stakes.require_find(user.value, "stake not found");

   asset claim_quantity = asset(0, symbol(sym, 4));
   claim_quantity.amount = stake_itr->bal.amount * itr_divds->reward_per_dfs;

   auto user_itr = _claims.find(user.value);
   if (user_itr == _claims.end())
   {
      _claims.emplace(get_self(), [&](auto &s) {
         s.user = user;
         s.amount = claim_quantity;
         s.next_dividend = itr_divds->next_dividend;
      });
   }
   else
   {
      check(user_itr->next_dividend < itr_divds->next_dividend, "you had claimed");
      _claims.modify(user_itr, same_payer, [&](auto &s) {
         s.amount = claim_quantity;
         s.next_dividend = itr_divds->next_dividend;
      });
   }

   if (claim_quantity.amount > 0)
   {
      action{permission_level{get_self(), "active"_n}, itr_divds->contract, "transfer"_n,
             std::make_tuple(get_self(), user, claim_quantity, std::string("claim reward"))}
          .send();
   }
}