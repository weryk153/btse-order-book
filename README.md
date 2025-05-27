# Order Book UI - BTSE Futures

本專案為一個即時更新的加密貨幣 Order Book 介面，串接 BTSE Futures 的 WebSocket API，展示買賣報價、成交價格，並具備價格與數量變動的動畫效果。

## 功能說明

- 即時訂閱 BTSE Futures 資料（報價與成交）
- 顯示前 8 檔買賣報價，包含價格、數量與累積總量
- 報價區背景深度條，依據累積量比例繪製
- 新價格高亮（紅/綠閃爍），數量變動高亮（漲綠/跌紅）
- 最新成交價顯示並附帶漲跌箭頭
- 初始畫面資料尚未載入時，顯示固定寬度的佔位符 `--`，避免排版跳動
- 使用 Tailwind CSS 搭配條件式樣式管理（如動畫、顏色）

## 專案結構

components/
├── LastPriceRow.tsx // 顯示最新成交價與漲跌圖示
├── OrderBook.tsx // Order Book 主容器，組合表頭、報價與成交價
├── QuoteRow.tsx // 單筆報價列，包含價格、數量、總量與動畫
├── QuoteTable.tsx // 顯示買或賣方向的報價列表

hooks/
├── useOrderBook.ts // 負責訂閱報價與成交資料，處理 snapshot/delta
├── useWebSocket.ts // 通用 WebSocket hook

store/
├── useOrderBookStore.ts // 使用 Zustand 管理 bids、asks、價格、動畫狀態等

utils/
├── format.ts // 數字格式化工具函式

## 技術棧

- React + TypeScript
- Zustand 狀態管理
- Tailwind CSS 樣式系統
- classnames 管理條件樣式
- BTSE WebSocket API 作為資料來源

## 快速啟動

```bash
# 安裝依賴
pnpm install

# 啟動本地開發伺服器
pnpm dev
```
