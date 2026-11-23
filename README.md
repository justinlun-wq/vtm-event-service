# VTM 活動服務網站

完整、可離線開啟及交畀自己 AI 修改的網站。案例版是首頁，A、B、C 版保留作比較；企業服務名稱為 **Team Building**。

直接瀏覽網站：https://justinlun-wq.github.io/vtm-event-service/

Repository：https://github.com/justinlun-wq/vtm-event-service

## 不需要 Git 或 GitHub 帳戶

1. [直接下載完整 ZIP](https://github.com/justinlun-wq/vtm-event-service/archive/refs/heads/main.zip)，或在 repository 選 **Code → Download ZIP**。
2. 解壓整個 ZIP，保留所有資料夾。
3. 用瀏覽器開 `dist/index.html`，即可查看網站、服務及相簿，毋須安裝任何程式。

## 用自己嘅 AI 修改

把整個解壓資料夾交畀支援檔案編輯的 AI，貼上：

> 先讀 AGENTS.md，再按我的要求修改來源檔。執行 build 及兩項驗證，保留 dist 產物，最後交回完整 ZIP 或修改分支。不要加入憑證，不要自行部署正式網站。

修改及驗證需要 Python 3.9+、Node.js 18+；只使用內置模組，沒有額外套件或 API key。

```sh
./setup.sh
```

或逐項執行：

```sh
python3 build.py
node verify.cjs
python3 verify_html.py
```

改好後重新開啟 `dist/index.html`。需要本機網址時可用 `python3 -m http.server 8000 --directory dist`，再開 `http://localhost:8000`。

## 交回修改

- 沒有 GitHub 帳戶：將完整修改版壓成 ZIP 交回維護者，再由維護者檢查及合併。
- 有 GitHub 帳戶：可 fork 及提交 Pull Request，或獲授權後用 GitHub 網頁編輯／上載檔案，不用安裝 Git。
- AI coding 工具：打開本機資料夾，或連接有權限的 repository 後提交分支。

公開下載不等於匿名寫入權限。沒有帳戶的人可完整讀取、下載、修改自己的副本，再用 ZIP 交回；直接改寫同一個 remote repository 需要登入及授權。多人協作前先下載最新版，交回時列明改動。

## 檔案位置

| 檔案 | 用途 |
| --- | --- |
| `build.py` | 方案名稱、共用頁框及原有三版 HTML 輸出 |
| `case_page.py`, `cases.json` | 案例首頁及各個獨立詳情的結構／文案 |
| `case-page.css`, `case-page-overrides.css`, `case-page.js` | 案例版排版、篩選、相簿搜尋、人數估算及電郵查詢 |
| `visitor_layouts.py` | A、B、C 及比較頁結構 |
| `visitor.js` | 訪客文案、服務切換及查詢摘要 |
| `visitor.css`, `program-design.css` | 響應式排版、相片頁首及成果卡 |
| `references.json` | 21 項公開訪客版參考，已移除內部來源記錄 |
| `references.js`, `references.css` | 相簿、對話框及相片展示 |
| `timeline-icons.js` | 流程插圖 |
| `scroll-guide.js`, `scroll-guide.css` | A 版閱讀導覽 |
| `dist/` | 可直接開啟的網站及本地圖片 |
| `verify.cjs`, `verify_html.py` | 互動、結構、本地資源及秘密字串檢查 |
| `skills/edit-event-page/SKILL.md` | AI 修改流程 |

## 發布及素材

此 copy 不含部署設定、登入資料、內部來源清單或私人記憶。修改本機檔案不會自動更新 VTM 正式網站或私人預覽；發布及改變觀眾權限需要維護者明確授權。查詢按鈕開啟電郵草稿，沒有表單後台。

相片及商標由各自權利人持有，公開原始碼不代表素材獲重新授權。新增或重新使用素材前應確認使用權。

自動驗證涵蓋所有案例詳情、三款活動、Hover／鍵盤／觸控事件邏輯、21 個參考、17 個相簿／61 張相片及查詢摘要。畫面仍需於桌面及手機瀏覽器檢視；自動檢查不代替視覺驗收。

## 公開預覽發布

此 GitHub repository 的 main 分支通過檢查後，會自動把 dist 發布至上述 GitHub Pages 網址。這只更新公開協作預覽，不會修改 VTM 正式網站或原有私人 Sites 預覽。


## 案例版

最新首頁採用同事提供的案例結構，保留原有相簿與活動方案，並新增 HAESL 的六張網站精選相片。HAESL 的 92 張來源相片保留在私人 Library，不把整批原檔加入公開 repository。HKIC（上水）的 22 張原相已入私人 Library；網站採用其中六張精選衍生圖，加入 2026 年 10 月 29 日活動案例及相簿。案例數目按已有活動資料整理，不設定固定數目。

航空安全案例的 48 m²／3 個站／3 天 16 節／約 300 人次沿用提供的案例設計稿；Justin 於 2026-11-23 確認與 HAESL 現場相片合併為同一案例，舊相片案例網址導向合併頁。其他案例使用已有的參與方式、日期及內容，不補造面積或出席數字。平面配置可放大，人次計算使用每小時約 20 人次，並提示佈置／午膳另計。建議活動的 30 人／2.5 小時／90 m² 與真實案例分開。

新版查詢保留四個欄位，姓名及工作電郵必填。按鈕準備 `mailto:` 草稿，由使用者在電郵程式確認及寄出，沒有後台送信或自動訂閱。

2026-11-20 的本機獨立 Chromium 驗收涵蓋 390／768／1440 px 的首頁與六個詳情頁、20 個參考對話框、55 張精選相片、案例／相簿篩選、搜尋、查詢內容交接、必填驗證、人次估算及平面圖焦點返回。這不代表實體 iPhone／Safari 或正式 WordPress 表單送達測試。

2026-11-23：航空公司現場相片及安全體驗安排已合併為一個案例，舊相片頁導向合併詳情；活動方案區改為常開三欄比較，規劃示例共用一次。

2026-11-23：整體排版以同事 v2 原稿為準（1160 px 版寬、原稿標題尺度、小／中／大型選擇）。過往活動相片改成直接瀏覽的 Gallery，保留全部 61 張精選相、篩選搜尋及放大切換。

Gallery 按活動分 Album：每個活動一張封面，點入後只切換該活動的相片。

場地規模（全部／小型／中型／大型）已收進「活動案例」，與活動類型交叉篩選。

案例卡參數改用線條 Icon 配短文字／數值，保留輔助閱讀標籤及詳情頁完整說明。


2026-11-23 示範方案方向：主頁上層改為五款活動分類（XR 探索工作坊、Team Building、安全情境培訓、開放式 XR 體驗區、展覽／論壇展示），不以真實客戶活動作入口。每款有小／中／大三個配置示例，共 15 張 Floor Plan，涵蓋 24–200 m²；尺寸、人次、設備、人手及流程均屬規劃示例。真實活動（包括 HKIC）只在主頁下方按 Album 展示。舊實例詳情網址保留相容，但不列入上層示範方案。

新示範內容由 `demos.json`、`demo_plans.py`、`demo-plans.js`、`demo-plans.css` 維護；其配置不代表保證接待量或已完成客戶活動。

五款方案卡沿用封面卡樣式，封面為可隨規模切換的 Floor Plan；卡片下方及詳情頁附真實活動參考相，連到五個對應 Portfolio。三個活動目標比較補回 25／105／20 分鐘 Timeline。參考相與示意配置分開標示，未將 Team Building 的假設任務套用到實際 Sino 教育工作坊。

最新 Thumbnail 指示：五款入口卡改回分類 Icon，Floor Plan 留在詳情頁；參考相、Portfolio 連結及目標 Timeline 保留。

Thumbnail 視覺修正：標籤選擇器只限 `[data-demo-cover-label]`，避免套用到 Icon。五個 Icon 置中顯示為 76 px，移除重疊徽章、重複序號及多餘卡片留白。
