# 图片压缩工具

一个现代、简约的在线图片压缩工具，支持 JPG、PNG、WebP、GIF 等常见图片格式的压缩处理。

## 功能特点

- **多格式支持**：支持 JPG、PNG、WebP、GIF 等常见图片格式
- **灵活压缩**：提供高/中/低质量预设，也可自定义压缩比例（10%-100%）
- **批量处理**：支持同时上传和压缩多张图片
- **实时对比**：显示原始图片与压缩后图片的尺寸、大小对比
- **拖放上传**：支持直接拖放图片文件到上传区域
- **响应式设计**：在手机和桌面设备上都有良好的使用体验
- **现代界面**：采用绿色主题的简约设计风格

## 技术栈

### 后端
- Node.js
- Express.js
- Sharp（图片处理库）
- Multer（文件上传中间件）

### 前端
- 原生 HTML5
- CSS3（响应式设计）
- 原生 JavaScript（ES6+）

## 安装和运行

### 前置要求

- Node.js 14.0 或更高版本
- npm 或 yarn

### 安装步骤

1. 克隆或下载项目到本地

2. 安装依赖：
```bash
npm install
```

3. 启动服务器：
```bash
npm start
```

开发模式（自动重启）：
```bash
npm run dev
```

4. 打开浏览器访问：
```
http://localhost:3000
```

## 使用说明

1. **上传图片**：
   - 点击上传区域选择文件
   - 或直接拖放图片到上传区域

2. **设置压缩质量**：
   - 选择预设的高/中/低质量
   - 或使用滑块自定义压缩质量

3. **查看结果**：
   - 查看原图和压缩后的对比
   - 查看文件大小和压缩比例

4. **下载图片**：
   - 单独下载每张压缩后的图片
   - 或使用"下载全部"批量下载

## 项目结构

```
image-compressor/
├── server.js           # 后端服务器主文件
├── package.json        # 项目配置和依赖
├── .gitignore         # Git 忽略文件
├── README.md          # 项目说明文档
├── public/            # 前端静态文件
│   ├── index.html     # 主页面
│   ├── style.css      # 样式文件
│   └── app.js         # 前端逻辑
├── uploads/           # 临时上传目录（自动创建）
└── compressed/        # 压缩后文件目录（自动创建）
```

## API 接口

### POST /api/compress
压缩图片

**请求参数：**
- `images`: 图片文件（multipart/form-data）
- `quality`: 压缩质量（10-100）

**响应示例：**
```json
{
  "success": true,
  "results": [
    {
      "originalName": "example.jpg",
      "originalSize": 1048576,
      "originalWidth": 1920,
      "originalHeight": 1080,
      "compressedSize": 524288,
      "compressedWidth": 1920,
      "compressedHeight": 1080,
      "compressionRatio": "50.00",
      "downloadUrl": "/api/download/compressed-xxxxx.jpg",
      "previewUrl": "/api/preview/compressed-xxxxx.jpg"
    }
  ]
}
```

### GET /api/preview/:filename
预览压缩后的图片

### GET /api/download/:filename
下载压缩后的图片

## 安全性

- 文件大小限制：10MB
- 支持的文件类型限制
- 文件自动清理：上传的文件会在 1 小时后自动删除
- XSS 防护：��有用户输入都经过转义处理

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
