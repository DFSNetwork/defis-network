project(pools)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( pools pools pools.cpp )
target_include_directories( pools PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( pools ${CMAKE_SOURCE_DIR}/../ricardian )