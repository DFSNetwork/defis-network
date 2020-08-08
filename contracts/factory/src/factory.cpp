#include <factory.hpp>

ACTION factory::mapping(uint64_t mid)
{
   require_auth(get_self());
   markets _markets(name("defisswapcnt"), name("defisswapcnt").value);
   auto m_itr = _markets.require_find(mid, "Market does not exist.");
   create_market(mid, get_self(), m_itr->contract0, m_itr->contract1, m_itr->sym0, m_itr->sym1);
}

void factory::create(name from, name to, asset quantity, std::string memo)
{
   if (from == _self || to != _self)
      return;

   check(quantity.amount == 50 * 10000, "pay 50 DFS to create");

   std::vector<std::string> strs = utils::split(memo, "-");
   check(strs.size()==4, "invalid memo");

   name contract0 = name(strs[0]) ;
   symbol_code sym0 = symbol_code(strs[1]);
   name contract1 = name(strs[2]) ;
   symbol_code sym1 = symbol_code(strs[3]) ;

   check((contract0 != contract1) || (sym0 != sym1), "invalid pair");
   auto supply0 = utils::get_supply(contract0, sym0);
   check(supply0.amount > 0, "invalid token0");
   check(supply0.symbol.code() == sym0, "invalid symbol0");
   auto supply1 = utils::get_supply(contract1, sym1);
   check(supply1.amount > 0, "invalid token1");
   check(supply1.symbol.code() == sym1, "invalid symbol1");

   uint64_t mid = get_mid();
   create_market(mid, get_self(), contract0, contract1, supply0.symbol, supply1.symbol);

   action(permission_level{get_self(), "active"_n}, name("defisswapcnt"), name("newmarket"),
          std::make_tuple(mid, contract0, contract1, supply0.symbol, supply1.symbol))
       .send();
}

void factory::create_market(uint64_t mid, name creator, name contract0, name contract1, symbol sym0, symbol sym1)
{
   bool reverse = contract0.value < contract1.value;

   name _contract0 = reverse ? contract0 : contract1;
   name _contract1 = reverse ? contract1 : contract0;
   symbol _sym0 = reverse ? sym0 : sym1;
   symbol _sym1 = reverse ? sym1 : sym0;

   std::string uni_key = _contract0.to_string();
   uni_key += "-";
   uni_key += _sym0.code().to_string();
   uni_key += ":";
   uni_key += _contract1.to_string();
   uni_key += "-";
   uni_key += _sym1.code().to_string();

   const char *uni_key_cstr = uni_key.c_str();
   checksum256 digest = sha256(uni_key_cstr, strlen(uni_key_cstr));

   auto itr = _pairs.find(utils::uint64_hash(digest));
   check(itr == _pairs.end(), "factory: market already exists");

   _pairs.emplace(creator, [&](auto &a) {
      a.digest = digest;
      a.unikey = uni_key;
      a.mid = mid;
   });
}

uint64_t factory::get_mid()
{
   globals glb = _globals.get_or_default(globals{});
   glb.market_id += 1;
   _globals.set(glb, _self);
   return glb.market_id;
}