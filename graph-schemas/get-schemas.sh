#!/usr/bin/env bash

npx get-graphql-schema https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby > graph-schemas/tuli.graphql
npx get-graphql-schema https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2 > graph-schemas/uniswap.graphql
