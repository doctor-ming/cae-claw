# GitHub 推送指南

## 方式 1: 使用 GitHub 网页（推荐）

### 步骤 1: 创建仓库
1. 访问 https://github.com/new
2. 填写仓库名称: `cae-claw`
3. 选择 Private 或 Public
4. **不要**勾选 "Add a README file"（已有）
5. 点击 "Create repository"

### 步骤 2: 推送代码
在终端运行以下命令（将 `YOUR_USERNAME` 替换为你的 GitHub 用户名）:

```bash
cd /workspace/cae-claw

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/cae-claw.git

# 重命名分支为 main
git branch -M main

# 推送代码
git push -u origin main
```

## 方式 2: 使用 GitHub CLI

如果已安装 `gh` CLI:

```bash
cd /workspace/cae-claw

# 创建仓库（不初始化）
gh repo create cae-claw --source=. --public

# 或者私有仓库
gh repo create cae-claw --source=. --private
```

## 验证推送成功

推送成功后访问:
- https://github.com/YOUR_USERNAME/cae-claw

你应该能看到:
- 📦 技能市场代码
- 🤖 Agent Core 引擎
- 🌐 React Web UI
- 📋 PRD 文档
