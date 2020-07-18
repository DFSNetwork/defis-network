project(logs)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( logs logs logs.cpp )
target_include_directories( logs PUBLIC ${CMAKE_SOURCE_DIR}/../include )
target_ricardian_directory( logs ${CMAKE_SOURCE_DIR}/../ricardian )