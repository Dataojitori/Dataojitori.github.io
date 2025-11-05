# GitHub Pages 部署说明

## 问题

GitHub Pages 默认构建会自动应用主题（如 jekyll-theme-primer），导致我们的自定义前端无法正常显示。

## 解决方案

我们已经创建了一个自定义的 GitHub Actions 工作流来完全控制构建过程。

## 必需的设置步骤

### 1. 启用 GitHub Actions 部署

1. 访问你的 GitHub 仓库：https://github.com/Dataojitori/Dataojitori.github.io
2. 点击 **Settings** （设置）
3. 在左侧菜单中点击 **Pages**
4. 在 **Build and deployment** 部分：
   - **Source**: 选择 **GitHub Actions** （而不是 "Deploy from a branch"）
5. 保存设置

### 2. 推送更改

```bash
git add .
git commit -m "Fix GitHub Pages deployment with custom Actions workflow"
git push origin main
```

### 3. 等待构建

- 访问 **Actions** 标签页查看构建进度
- 第一次构建可能需要 2-3 分钟
- 构建成功后，你的网站将自动部署

## 更改内容

### 新增文件
- `.github/workflows/jekyll.yml` - 自定义构建工作流

### 修改文件
- `Gemfile` - 移除 Minima 主题依赖
- `_config.yml` - 明确不使用 gem 主题，添加 exclude 列表

## 验证

构建成功后，访问 https://dataojitori.github.io 应该能看到：

✅ 赛博朋克深色主题
✅ Matrix 数字雨背景
✅ 终端风格 Hero 区域
✅ 自定义文章卡片
✅ 响应式导航

## 故障排除

### 如果构建失败

1. 检查 Actions 标签页的错误信息
2. 确保已选择 "GitHub Actions" 作为部署源
3. 检查 `_config.yml` 和 `Gemfile` 的语法

### 如果样式没有应用

1. 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）
2. 检查浏览器开发者工具的 Console 是否有 404 错误
3. 等待几分钟，GitHub CDN 可能需要时间更新

### 本地测试

在推送前，你可以本地测试：

```bash
bundle install
bundle exec jekyll serve
```

访问 http://localhost:4000 查看效果。

## 为什么需要这个改变？

GitHub Pages 默认使用 `github-pages` gem，它会：
1. 强制使用特定的 Jekyll 版本
2. 自动应用一个默认主题
3. 限制可用的插件

使用 GitHub Actions 可以：
1. 完全控制构建环境
2. 使用任何 Jekyll 版本和配置
3. 自由使用自定义布局和样式
4. 更灵活的部署选项

## 参考

- [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Jekyll Actions 文档](https://jekyllrb.com/docs/continuous-integration/github-actions/)
