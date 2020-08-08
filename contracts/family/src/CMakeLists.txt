project(family)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( family family family.cpp )
target_include_directories( family PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( family ${CMAKE_SOURCE_DIR}/../ricardian )