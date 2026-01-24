# Device Demo

设备资源管理移动端 Demo（React + TypeScript + Vite）。界面包含驾驶舱、资源库、调度中心、个人中心与扫码模拟场景，主要用于展示设备管理与调度流程的交互设计。

## 主要功能

- **驾驶舱**：关键指标、待办任务、资源分布概览。
- **资源库**：设备检索、分类筛选、设备状态与位置展示。
- **调度中心**：租赁流程追踪、历史单据列表。
- **个人中心**：个人信息与快捷入口。
- **扫码模拟**：二维码/资产标签扫描界面。

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS

## 本地开发

```bash
npm install
npm run dev
```

## 常用脚本

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 预览构建产物
npm run lint     # 代码检查
```

## 目录结构

```text
src/
  App.tsx        # 主界面与交互逻辑
  App.css        # App 级样式
  index.css      # 全局样式
  main.tsx       # 入口文件
```

## 备注

- 目前数据为前端模拟数据，便于展示交互与布局。
- 如需对接真实接口，可在 `App.tsx` 中替换模拟数据与状态逻辑。
