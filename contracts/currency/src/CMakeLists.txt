project(currency)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( currency currency currency.cpp )
target_include_directories( currency PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( currency ${CMAKE_SOURCE_DIR}/../ricardian )