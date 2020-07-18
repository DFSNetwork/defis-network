#include <types.hpp>
namespace utils
{
using std::string;

vector<string> split(const string &str, const string &delim)
{
   vector<string> strs;
   size_t prev = 0, pos = 0;
   do
   {
      pos = str.find(delim, prev);
      if (pos == string::npos)
         pos = str.length();
      string s = str.substr(prev, pos - prev);
      if (!str.empty())
         strs.push_back(s);
      prev = pos + delim.length();
   } while (pos < str.length() && prev < str.length());
   return strs;
}


void inline_transfer(name contract, name from, name to, asset quantity, string memo)
{
    action(
        permission_level{from, "active"_n},
        contract,
        name("transfer"),
        make_tuple(from, to, quantity, memo))
        .send();
}

/**
 * @brief Calculates maturity time of purchased REX tokens which is 4 days from end
 * of the day UTC
 *
 * @return time_point_sec
 */
time_point_sec get_rex_maturity()
{
   const uint32_t seconds_per_day = 24 * 3600;
   const uint32_t num_of_maturity_buckets = 5;
   static const uint32_t now = current_time_point().sec_since_epoch();
   static const uint32_t r = now % seconds_per_day;
   static const time_point_sec rms{now - r + num_of_maturity_buckets * seconds_per_day};
   return rms;
}

} // namespace utils