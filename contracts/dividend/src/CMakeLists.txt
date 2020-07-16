project(dividend)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( dividend dividend dividend.cpp )
target_include_directories( dividend PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( dividend ${CMAKE_SOURCE_DIR}/../ricardian )