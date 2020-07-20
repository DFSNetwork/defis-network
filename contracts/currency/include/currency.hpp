#include <utils.hpp>

CONTRACT currency : public contract
{
public:
    using contract::contract;

    currency(name receiver, name code, datastream<const char *> ds)
        : contract(receiver, code, ds),
          _debts(_self, _self.value),
          _globals(_self, _self.value) {}

    void handle_deposit(name from, name to, asset quantity, string memo);
    void handle_redeem(name from, name to, asset quantity, string memo);
    void redirect(name from, name to, asset quantity, string memo, name code);

    void usdtin(name from, name to, asset quantity, string memo);
    void usddback(name from, name to, asset quantity, string memo);

    /**
    * Init action.
    *
    * @details Allows `issuer` account to create a token in supply of `maximum_supply`.
    * @details Init action initializes the system contract for a version and a symbol.
    * Only succeeds when:
    * - version is 0 and
    * - symbol is found and
    * - system token supply is greater than 0,
    * - and system contract wasn’t already been initialized.
    * @param issuer - the account that creates the token,
    * @param maximum_supply - the maximum supply set for the token created.
    *
    * @pre Token symbol has to be valid,
    * @pre Token symbol must not be already created,
    * @pre maximum_supply has to be smaller than the maximum supply allowed by the system: 1^62 - 1.
    * @pre Maximum supply must be positive;
    *
    * If validation is successful a new entry in statstable for token symbol scope gets created.
    */
    [[eosio::action]] 
    void init(const name &dao,
                                const asset &maximum_supply);
    /**
       * Issue action.
       *
       * @details This action issues to `to` account a `quantity` of tokens.
       *
       * @param to - the account to issue tokens to, it must be the same as the issuer,
       * @param quntity - the amount of tokens to be issued,
       * @memo - the memo string that accompanies the token issue transaction.
       */
    [[eosio::action]] 
    void issue(const name &to, const asset &quantity, const string &memo);

    /**
       * Retire action.
       *
       * @details The opposite for create action, if all validations succeed,
       * it debits the statstable.supply amount.
       *
       * @param quantity - the quantity of tokens to retire,
       * @param memo - the memo string to accompany the transaction.
       */
    [[eosio::action]] 
    void retire(const asset &quantity, const string &memo);

    /**
       * Transfer action.
       *
       * @details Allows `from` account to transfer to `to` account the `quantity` tokens.
       * One account is debited and the other is credited with quantity tokens.
       *
       * @param from - the account to transfer from,
       * @param to - the account to be transferred to,
       * @param quantity - the quantity of tokens to be transferred,
       * @param memo - the memo string to accompany the transaction.
       */
    [[eosio::action]] 
    void transfer(const name &from,
                                    const name &to,
                                    const asset &quantity,
                                    const string &memo);
    /**
       * Open action.
       *
       * @details Allows `ram_payer` to create an account `owner` with zero balance for
       * token `symbol` at the expense of `ram_payer`.
       *
       * @param owner - the account to be created,
       * @param symbol - the token to be payed with by `ram_payer`,
       * @param ram_payer - the account that supports the cost of this action.
       *
       * More information can be read [here](https://github.com/EOSIO/eosio.contracts/issues/62)
       * and [here](https://github.com/EOSIO/eosio.contracts/issues/61).
       */
    [[eosio::action]] 
    void open(const name &owner, const symbol &symbol, const name &ram_payer);

    /**
       * Close action.
       *
       * @details This action is the opposite for open, it closes the account `owner`
       * for token `symbol`.
       *
       * @param owner - the owner account to execute the close action for,
       * @param symbol - the symbol of the token to execute the close action for.
       *
       * @pre The pair of owner plus symbol has to exist otherwise no action is executed,
       * @pre If the pair of owner plus symbol exists, the balance has to be zero.
       */
    [[eosio::action]] 
    void close(const name &owner, const symbol &symbol);

    /**
       * Stake action.
       *
       * @details Allows debt `owner` to buy rex with pledge.
       *
       * @param debtid - the id of the debt record.
       *
       * @pre The balance of rex_received has to be zero.
       */
    [[eosio::action]] void stake(const uint64_t &debtid);

    [[eosio::action]] void profit(const asset bal);

    [[eosio::action]] void dostake(const uint64_t &debtid, const asset rex);

    /**
       * Vote action.
       *
       * @details Allows any to call this action to vote for a producer or vote proxy. 
       *  The producer or vote proxy assign by `DAO`.
       */
    [[eosio::action]] void vote();

    /**
       * Get supply method.
       *
       * @details Gets the supply for token `sym_code`, created by `token_contract_account` account.
       *
       * @param token_contract_account - the account to get the supply for,
       * @param sym_code - the symbol to get the supply for.
       */
    static asset get_supply(const name &token_contract_account, const symbol_code &sym_code)
    {
        stats statstable(token_contract_account, sym_code.raw());
        const auto &st = statstable.get(sym_code.raw());
        return st.supply;
    }

    /**
       * Get balance method.
       *
       * @details Get the balance for a token `sym_code` created by `token_contract_account` account,
       * for account `owner`.
       *
       * @param token_contract_account - the token creator account,
       * @param owner - the account for which the token balance is returned,
       * @param sym_code - the token for which the balance is returned.
       */
    static asset get_balance(const name &token_contract_account, const name &owner, const symbol_code &sym_code)
    {
        accounts accountstable(token_contract_account, owner.value);
        const auto &ac = accountstable.get(sym_code.raw());
        return ac.balance;
    }

    // Returns the core symbol by system account name
    // @param system_account - the system account to get the core symbol for.
    static symbol get_core_symbol(name system_account = "eosio"_n)
    {
        rammarket rm(system_account, system_account.value);
        auto itr = rm.find(ramcore_symbol.raw());
        check(itr != rm.end(), "system contract must first be initialized");
        return itr->quote.balance.symbol;
    }

    using init_action = eosio::action_wrapper<"init"_n, &currency::init>;
    using issue_action = eosio::action_wrapper<"issue"_n, &currency::issue>;
    using retire_action = eosio::action_wrapper<"retire"_n, &currency::retire>;
    using transfer_action = eosio::action_wrapper<"transfer"_n, &currency::transfer>;
    using open_action = eosio::action_wrapper<"open"_n, &currency::open>;
    using close_action = eosio::action_wrapper<"close"_n, &currency::close>;

private:
    struct [[eosio::table]] account
    {
        asset balance;

        uint64_t primary_key() const { return balance.symbol.code().raw(); }
    };

    struct [[eosio::table]] currency_stats
    {
        asset supply;
        asset max_supply;
        name issuer;

        uint64_t primary_key() const { return supply.symbol.code().raw(); }
    };

    struct [[eosio::table]] globals
    {
        name dao;
        symbol sym;
        uint64_t debtid;

        EOSLIB_SERIALIZE(globals, (dao)(sym)(debtid))
    };

    struct [[eosio::table]] debt
    {
        uint64_t id;
        name owner;
        asset pledge;
        asset issue;
        asset rex_received = asset(0, rex_symbol);
        time_point_sec rex_maturity;
        time_point_sec create_time;

        uint64_t primary_key() const { return id; }
        uint64_t byname() const { return owner.value; }

        EOSLIB_SERIALIZE(debt, (id)(owner)(pledge)(issue)(rex_received)(rex_maturity)(create_time))
    };

    typedef eosio::multi_index<"accounts"_n, account> accounts;
    typedef eosio::multi_index<"stat"_n, currency_stats> stats;

    typedef multi_index<"debts"_n, debt, indexed_by<"byname"_n, const_mem_fun<debt, uint64_t, &debt::byname>>> debts;
    debts _debts;

    typedef eosio::singleton<"globals"_n, globals> globals_index;
    globals_index _globals;

    void sub_balance(const name &owner, const asset &value);
    void add_balance(const name &owner, const asset &value, const name &ram_payer);

    uint64_t get_id();
};