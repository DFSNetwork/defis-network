project(mining)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( mining mining mining.cpp )
target_include_directories( mining PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( mining ${CMAKE_SOURCE_DIR}/../ricardian )