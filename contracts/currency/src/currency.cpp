#include <currency.hpp>

void currency::init(const name &dao,
                    const asset &maximum_supply)
{
   require_auth(get_self());

   check(!_globals.exists(), "contract has already been initialized");

   _globals.get_or_create(_self,
                          globals{
                              .dao = dao,
                              .sym = maximum_supply.symbol});

   auto sym = maximum_supply.symbol;
   check(sym.is_valid(), "invalid symbol name");
   check(maximum_supply.is_valid(), "invalid supply");
   check(maximum_supply.amount > 0, "max-supply must be positive");

   stats statstable(get_self(), sym.code().raw());
   auto existing = statstable.find(sym.code().raw());
   check(existing == statstable.end(), "token with symbol already exists");

   statstable.emplace(get_self(), [&](auto &s) {
      s.supply.symbol = maximum_supply.symbol;
      s.max_supply = maximum_supply;
      s.issuer = get_self();
   });
}

void currency::issue(const name &to, const asset &quantity, const string &memo)
{
   auto sym = quantity.symbol;
   check(sym.is_valid(), "invalid symbol name");
   check(memo.size() <= 256, "memo has more than 256 bytes");

   stats statstable(get_self(), sym.code().raw());
   auto existing = statstable.find(sym.code().raw());
   check(existing != statstable.end(), "token with symbol does not exist, create token before issue");
   const auto &st = *existing;
   check(to == st.issuer, "tokens can only be issued to issuer account");

   require_auth(st.issuer);
   check(quantity.is_valid(), "invalid quantity");
   check(quantity.amount > 0, "must issue positive quantity");

   check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
   check(quantity.amount <= st.max_supply.amount - st.supply.amount, "quantity exceeds available supply");

   statstable.modify(st, same_payer, [&](auto &s) {
      s.supply += quantity;
   });

   add_balance(st.issuer, quantity, st.issuer);
}

void currency::retire(const asset &quantity, const string &memo)
{
   auto sym = quantity.symbol;
   check(sym.is_valid(), "invalid symbol name");
   check(memo.size() <= 256, "memo has more than 256 bytes");

   stats statstable(get_self(), sym.code().raw());
   auto existing = statstable.find(sym.code().raw());
   check(existing != statstable.end(), "token with symbol does not exist");
   const auto &st = *existing;

   require_auth(st.issuer);
   check(quantity.is_valid(), "invalid quantity");
   check(quantity.amount > 0, "must retire positive quantity");

   check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");

   statstable.modify(st, same_payer, [&](auto &s) {
      s.supply -= quantity;
   });

   sub_balance(st.issuer, quantity);
}

void currency::transfer(const name &from,
                        const name &to,
                        const asset &quantity,
                        const string &memo)
{
   check(from != to, "cannot transfer to self");
   require_auth(from);
   check(is_account(to), "to account does not exist");
   auto sym = quantity.symbol.code();
   stats statstable(get_self(), sym.raw());
   const auto &st = statstable.get(sym.raw());

   require_recipient(from);
   require_recipient(to);

   check(quantity.is_valid(), "invalid quantity");
   check(quantity.amount > 0, "must transfer positive quantity");
   check(quantity.symbol == st.supply.symbol, "symbol precision mismatch");
   check(memo.size() <= 256, "memo has more than 256 bytes");

   auto payer = has_auth(to) ? to : from;

   sub_balance(from, quantity);
   add_balance(to, quantity, payer);

   if (to == _self)
   {
      handle_redeem(from, to, quantity, memo);
   }
}

void currency::sub_balance(const name &owner, const asset &value)
{
   accounts from_acnts(get_self(), owner.value);

   const auto &from = from_acnts.get(value.symbol.code().raw(), "no balance object found");
   check(from.balance.amount >= value.amount, "overdrawn balance");

   from_acnts.modify(from, owner, [&](auto &a) {
      a.balance -= value;
   });
}

void currency::add_balance(const name &owner, const asset &value, const name &ram_payer)
{
   accounts to_acnts(get_self(), owner.value);
   auto to = to_acnts.find(value.symbol.code().raw());
   if (to == to_acnts.end())
   {
      to_acnts.emplace(ram_payer, [&](auto &a) {
         a.balance = value;
      });
   }
   else
   {
      to_acnts.modify(to, same_payer, [&](auto &a) {
         a.balance += value;
      });
   }
}

void currency::open(const name &owner, const symbol &symbol, const name &ram_payer)
{
   require_auth(ram_payer);

   check(is_account(owner), "owner account does not exist");

   auto sym_code_raw = symbol.code().raw();
   stats statstable(get_self(), sym_code_raw);
   const auto &st = statstable.get(sym_code_raw, "symbol does not exist");
   check(st.supply.symbol == symbol, "symbol precision mismatch");

   accounts acnts(get_self(), owner.value);
   auto it = acnts.find(sym_code_raw);
   if (it == acnts.end())
   {
      acnts.emplace(ram_payer, [&](auto &a) {
         a.balance = asset{0, symbol};
      });
   }
}

void currency::close(const name &owner, const symbol &symbol)
{
   require_auth(owner);
   accounts acnts(get_self(), owner.value);
   auto it = acnts.find(symbol.code().raw());
   check(it != acnts.end(), "Balance row already deleted or never existed. Action won't have any effect.");
   check(it->balance.amount == 0, "Cannot close because the balance is not zero.");
   acnts.erase(it);
}

void currency::stake(const uint64_t &debtid)
{
   auto debt = _debts.require_find(debtid, "Debt does not exist.");
   require_auth(debt->owner);
   check(debt->rex_received.amount == 0, "Already staked.");

   asset current_rex_balance(0, rex_symbol);
   auto itr = _rexbalance.find(get_self().value);
   if (itr != _rexbalance.end())
   {
      current_rex_balance.amount = itr->rex_balance.amount;
   }

   action(
       permission_level{get_self(), "active"_n},
       name("eosio"),
       name("deposit"),
       make_tuple(get_self(), debt->pledge))
       .send();

   action(
       permission_level{get_self(), "active"_n},
       name("eosio"),
       name("buyrex"),
       make_tuple(get_self(), debt->pledge))
       .send();

   action(
       permission_level{get_self(), "active"_n},
       get_self(),
       name("dostake"),
       make_tuple(debtid, current_rex_balance))
       .send();
}

void currency::dostake(const uint64_t &debtid, const asset rex)
{
   require_auth(get_self());
   auto debt = _debts.require_find(debtid, "Debt does not exist.");
   check(debt->rex_received.amount == 0, "Already staked.");

   auto itr = _rexbalance.require_find(get_self().value, "Rex balance of Bank shouldn't be empty.");
   check(itr->rex_balance.amount > rex.amount, "New rex balance should be greater than old value.");

   asset rex_received = itr->rex_balance - rex;
   _debts.modify(debt, same_payer, [&](auto &s) {
      s.rex_received = rex_received;
      s.rex_maturity = utils::get_rex_maturity();
   });
}

void currency::vote()
{
   globals glb = _globals.get();

   configs_index _configs(glb.dao, glb.dao.value);
   configs cfg = _configs.get();

   action(
       permission_level{get_self(), "active"_n},
       name("eosio"),
       name("voteproducer"),
       make_tuple(get_self(), cfg.vote_proxy, vector<name>{}))
       .send();
}

void currency::usdtin(name from, name to, asset quantity, string memo)
{
   if (from == _self || to != _self)
      return;

   globals glb = _globals.get();

   // get dao from global
   configs_index _configs(glb.dao, glb.dao.value);

   asset issue_quantity = asset(quantity.amount, glb.sym);

   // issue and transfer USDD token
   SEND_INLINE_ACTION(*this, issue, {_self, name("active")}, {_self, issue_quantity, memo});
   SEND_INLINE_ACTION(*this, transfer, {_self, name("active")}, {_self, from, issue_quantity, memo});
}

void currency::handle_deposit(name from, name to, asset quantity, string memo)
{
   if (from == _self || to != _self)
      return;

   if (from == name("eosio") || from == name("eosio.ram") || from == name("eosio.rex") || from == name("eosio.stake"))
      return;

   globals glb = _globals.get();
   // get dao from global
   configs_index _configs(glb.dao, glb.dao.value);

   vector<std::string> strs = utils::split(memo, ":");
   string act = strs[0];

   if (act == "mint")
   {
      auto sym = get_core_symbol();
      check(sym == quantity.symbol, "only accept core token.");

      configs cfg = _configs.get();
      check(quantity.amount >= cfg.minimum_deposit, "less than minimum_deposit");

      // get oracle from dao
      avgprices _avgprices(cfg.price_oracle, cfg.market_id);
      // get avg price from oracle
      const auto &pricedata = _avgprices.get(cfg.price_period);
      auto price = pricedata.price0_avg_price;
      // check price
      check(price > cfg.price_lower_bound, "price_lower_bound protection");
      check(price < cfg.price_upper_bound, "price_upper_bound protection");

      // calculate issue quantity
      asset issue_quantity = asset(0, glb.sym);
      asset pay_quantity = asset(0, glb.sym);
      asset fee_quantity = asset(0, glb.sym);

      uint64_t collateral_ratio = cfg.minimum_collateral_ratio;
      uint64_t rate = atoi(strs[1].c_str());

      if (rate < cfg.minimum_collateral_ratio)
      {
         rate = cfg.minimum_collateral_ratio;
      }

      issue_quantity.amount = quantity.amount * price * 100 / rate / 10000ll;
      fee_quantity.amount = issue_quantity.amount / 1000 * cfg.mint_fee;
      check(issue_quantity.amount > fee_quantity.amount, "Invalid fee amount");
      pay_quantity.amount = issue_quantity.amount - fee_quantity.amount;

      // save debt record
      _debts.emplace(_self, [&](auto &s) {
         s.id = get_id();
         s.owner = from;
         s.pledge = quantity;
         s.issue = issue_quantity;
         s.create_time = current_time_point();
      });

      // issue and transfer USDD token
      SEND_INLINE_ACTION(*this, issue, {_self, name("active")}, {_self, issue_quantity, memo});

      SEND_INLINE_ACTION(*this, transfer, {_self, name("active")}, {_self, from, pay_quantity, memo});
      if (fee_quantity.amount > 0)
      {
         string fee_memo = string("mint fee");
         SEND_INLINE_ACTION(*this, transfer, {_self, name("active")}, {_self, glb.dao, fee_quantity, fee_memo});
      }
   }
   else
   {
      // redirect to dao
      utils::inline_transfer(name("eosio.token"), get_self(), glb.dao, quantity, memo);
   }
}

void currency::redirect(name from, name to, asset quantity, string memo, name code)
{
   if (from == _self || to != _self)
      return;
   // redirect to dao
   globals glb = _globals.get();
   utils::inline_transfer(code, get_self(), glb.dao, quantity, memo);
}

void currency::profit(const asset bal)
{
   require_auth(get_self());
   asset cur_bal = get_balance(name("eosio.token"), get_self(), bal.symbol.code());
   check(cur_bal.amount >= bal.amount, "invalid balance");
   uint64_t prifit_amount = cur_bal.amount - bal.amount;
   if (prifit_amount > 0)
   {
      globals glb = _globals.get();
      utils::inline_transfer(name("eosio.token"), get_self(), glb.dao, asset(prifit_amount, bal.symbol), string("stake profit"));
   }
}

void currency::handle_redeem(name from, name to, asset quantity, string memo)
{
   vector<std::string> strs = utils::split(memo, ":");
   string act = strs[0];
   uint64_t id = atoi(strs[1].c_str());

   check(quantity.amount >= 1000, "less than 0.1 USDT");

   if (act == "burn")
   {
      // retire USDD
      action(permission_level{get_self(), "active"_n}, get_self(), name("retire"),
             make_tuple(quantity, string("user burn USDD")))
          .send();

      asset usdt_out = asset(quantity.amount, symbol("USDT", 4));
      asset fee = usdt_out / 1000 * 3; // 0.3% fee
      if (fee.amount > 0)
      {
         globals glb = _globals.get();
         asset usdt_fee = asset(fee.amount, symbol("USDT", 4));
         utils::inline_transfer(name("tethertether"), get_self(), glb.dao, usdt_fee, string("burn USDD fee"));
         usdt_out -= fee;
      }
      
      // return USDT to owner
      utils::inline_transfer(name("tethertether"), get_self(), from, usdt_out, string("return USDT"));
   }
   else if (act == "redeem")
   {
      auto debt = _debts.require_find(id, "Debt does not exist.");
      check(from == debt->owner, "Permission denied");
      check(quantity == debt->issue, "Invalid quantity.");

      if (debt->rex_received.amount > 0)
      {
         check(current_time_point().sec_since_epoch() >= debt->rex_maturity.sec_since_epoch(), "Can not reedeem while staking.");

         // sell rex and withraw rex fund
         action(
             permission_level{get_self(), "active"_n},
             name("eosio"),
             name("sellrex"),
             make_tuple(get_self(), debt->rex_received))
             .send();

         action(
             permission_level{get_self(), "active"_n},
             name("eosio"),
             name("withdraw"),
             make_tuple(get_self(), debt->pledge))
             .send();

         asset cur_bal = get_balance(name("eosio.token"), get_self(), debt->pledge.symbol.code());
         cur_bal += debt->pledge;
         action(
             permission_level{get_self(), "active"_n},
             get_self(),
             name("profit"),
             make_tuple(cur_bal))
             .send();
      }

      // retire USDD
      action(
          permission_level{get_self(), "active"_n},
          get_self(),
          name("retire"),
          make_tuple(quantity, string("user redeem retire")))
          .send();

      // return pledge to owner
      utils::inline_transfer(name("eosio.token"), get_self(), debt->owner, debt->pledge, string("return pledge"));

      // remove debt record
      _debts.erase(debt);
   }
   else
   {
      check(false, "Invalid memo.");
   }
}

uint64_t currency::get_id()
{
   globals glb = _globals.get();
   glb.debtid += 1;
   _globals.set(glb, _self);
   return glb.debtid;
}

extern "C"
{
   void apply(uint64_t receiver, uint64_t code, uint64_t action)
   {
      auto self = receiver;

      if (code == self)
      {
         switch (action)
         {
            EOSIO_DISPATCH_HELPER(currency, (init)(issue)(retire)(transfer)(open)(close)(stake)(dostake)(vote)(profit))
         }
      }
      else
      {
         if (action == name("transfer").value)
         {
            currency instance(name(receiver), name(code), datastream<const char *>(nullptr, 0));
            const auto t = unpack_action_data<transfer_args>();
            if (code == name("eosio.token").value)
            {
               instance.handle_deposit(t.from, t.to, t.quantity, t.memo);
            }
            else if (code == name("tethertether").value)
            {
               instance.usdtin(t.from, t.to, t.quantity, t.memo);
            }
            else
            {
               instance.redirect(t.from, t.to, t.quantity, t.memo, name(code));
            }
         }
      }
   }
}