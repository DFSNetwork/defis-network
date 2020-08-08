project(factory)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( factory factory factory.cpp )
target_include_directories( factory PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( factory ${CMAKE_SOURCE_DIR}/../ricardian )