#include <logs.hpp>
ACTION logs::swaplog(name user, uint64_t mid, asset amountIn, asset amountOut, string memo)
{
    require_auth(SWAP_ACCOUNT);
}

ACTION logs::depositlog(name user, uint64_t mid, asset quantity0, asset quantity1)
{
    require_auth(SWAP_ACCOUNT);
}

ACTION logs::withdrawlog(name user, uint64_t mid, uint64_t amount, asset quantity0, asset quantity1)
{
    require_auth(SWAP_ACCOUNT);
}