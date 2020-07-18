project(staking)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( staking staking staking.cpp )
target_include_directories( staking PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( staking ${CMAKE_SOURCE_DIR}/../ricardian )