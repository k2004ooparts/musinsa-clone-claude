#!/bin/sh
# 이 Mac에는 시스템 Node가 없어서 .tools에 받아둔 Node를 PATH에 추가해 실행한다.
export PATH="/Users/donguk/당근 클로드/.tools/node/bin:$PATH"
cd "/Users/donguk/당근 클로드/musinsa"
exec npm run dev
