# API 测试指南

这份指南将教你如何测试图片压缩工具的所有 API 接口。

## 快速开始

### 方法 1：使用自动测试脚本（推荐）

```bash
# 1. 确保服务器正在运行
npm start

# 2. 在项目目录放置一个测试图片（命名为 test.jpg 或 test.png）
# 或者使用任意 .jpg/.png 图片

# 3. 运行测试脚本
./test-api.sh
```

测试脚本会自动：
- ✅ 检查服务器状态
- ✅ 上传并压缩图片
- ✅ 预览压缩后的图片
- ✅ 下载压缩后的图片
- ✅ 生成测试报告

结果会保存在 `test_results/` 目录中。

---

## 方法 2：手动使用 curl 测试

### 前置条件

确保服务器正在运行：
```bash
npm start
# 服务器应该显示: 图片压缩服务器运行在 http://localhost:3000
```

### 测试 1: 压缩图片 API

**单图片上传：**
```bash
curl -X POST http://localhost:3000/api/compress \
  -F "images=@test.jpg" \
  -F "quality=80"
```

**多图片批量上传：**
```bash
curl -X POST http://localhost:3000/api/compress \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.png" \
  -F "images=@photo3.webp" \
  -F "quality=60"
```

**不同压缩质量：**
```bash
# 高质量 (90%)
curl -X POST http://localhost:3000/api/compress \
  -F "images=@test.jpg" \
  -F "quality=90"

# 中等质量 (60%)
curl -X POST http://localhost:3000/api/compress \
  -F "images=@test.jpg" \
  -F "quality=60"

# 低质量 (40%)
curl -X POST http://localhost:3000/api/compress \
  -F "images=@test.jpg" \
  -F "quality=40"
```

**响应示例：**
```json
{
  "success": true,
  "results": [
    {
      "originalName": "test.jpg",
      "originalSize": 2048576,
      "originalWidth": 1920,
      "originalHeight": 1080,
      "compressedSize": 819200,
      "compressedWidth": 1920,
      "compressedHeight": 1080,
      "compressionRatio": "60.00",
      "downloadUrl": "/api/download/compressed-1710000000-123456789.jpg",
      "previewUrl": "/api/preview/compressed-1710000000-123456789.jpg"
    }
  ]
}
```

---

### 测试 2: 预览图片 API

从上一步的响应中复制 `previewUrl`，然后：

```bash
# 方法 1: 在浏览器中打开
open http://localhost:3000/api/preview/compressed-1710000000-123456789.jpg

# 方法 2: 下载到本地查看
curl http://localhost:3000/api/preview/compressed-1710000000-123456789.jpg \
  --output preview.jpg

# 然后打开查看
open preview.jpg
```

---

### 测试 3: 下载图片 API

从第一步的响应中复制 `downloadUrl`，然后：

```bash
# 下载图片
curl http://localhost:3000/api/download/compressed-1710000000-123456789.jpg \
  --output downloaded.jpg

# 查看文件大小
ls -lh downloaded.jpg

# 打开查看
open downloaded.jpg
```

---

## 方法 3：使用浏览器测试

### 1. 打开网站
```
http://localhost:3000
```

### 2. 使用开发者工具监控 API

**Chrome / Firefox:**
1. 按 `F12` 打开开发者工具
2. 切换到 **Network（网络）** 标签
3. 上传一张图片
4. 观察以下请求：

**请求 1: 压缩请求**
```
POST /api/compress
Request Payload: FormData (images + quality)
Response: JSON 数据
```

**请求 2: 预览请求**
```
GET /api/preview/compressed-xxx.jpg
Response: Image 二进制数据
```

**请求 3: 下载请求**（点击下载按钮时）
```
GET /api/download/compressed-xxx.jpg
Response: Image 二进制数据 + Content-Disposition 头
```

---

## 方法 4：使用 Postman 测试

### 测试压缩 API

1. **创建新请求**
   - Method: `POST`
   - URL: `http://localhost:3000/api/compress`

2. **设置 Body**
   - 选择 `form-data`
   - 添加字段：
     - Key: `images` (类型: File)，Value: 选择图片文件
     - Key: `quality` (类型: Text)，Value: `80`

3. **发送请求**
   - 点击 `Send`
   - 查看响应 JSON

4. **测试预览/下载**
   - 复制响应中的 `previewUrl` 或 `downloadUrl`
   - 创建新的 GET 请求
   - 发送并查看图片

---

## 测试用例

### 正常场景测试

| 测试项 | 期望结果 |
|--------|---------|
| 上传 JPEG 图片，质量 80% | ✅ 返回成功，压缩比 30-70% |
| 上传 PNG 图片，质量 60% | ✅ 返回成功，压缩比 20-60% |
| 上传 WebP 图片，质量 90% | ✅ 返回成功，压缩比 10-40% |
| 批量上传 3 张图片 | ✅ 返回 3 个结果 |
| 预览压缩后图片 | ✅ 正常显示图片 |
| 下载压缩后图片 | ✅ 触发下载，文件名正确 |

### 异常场景测试

| 测试项 | 期望结果 |
|--------|---------|
| 上传非图片文件 (.txt) | ❌ 返回错误：只支持图片格式 |
| 上传超大文件 (>10MB) | ❌ 返回错误：文件大小限制 |
| 上传超过 10 个文件 | ❌ 只处理前 10 个 |
| 不传 quality 参数 | ✅ 使用默认值 80 |
| quality 超出范围 (150) | ✅ 仍然处理（Sharp 会调整） |
| 访问不存在的文件 | ❌ 返回 404 错误 |

---

## 测试脚本示例

### Bash 脚本

```bash
#!/bin/bash

# 测试所有质量级别
for quality in 40 60 80 90; do
    echo "测试质量: $quality%"
    curl -X POST http://localhost:3000/api/compress \
        -F "images=@test.jpg" \
        -F "quality=$quality" \
        -o "result_$quality.json"
    echo ""
done
```

### Python 脚本

```python
import requests

# 测试压缩
with open('test.jpg', 'rb') as f:
    files = {'images': f}
    data = {'quality': 80}
    response = requests.post('http://localhost:3000/api/compress', files=files, data=data)
    result = response.json()
    print(result)

    # 下载压缩后的图片
    download_url = result['results'][0]['downloadUrl']
    image = requests.get(f'http://localhost:3000{download_url}')
    with open('compressed.jpg', 'wb') as f:
        f.write(image.content)
```

### Node.js 脚本

```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testAPI() {
    const form = new FormData();
    form.append('images', fs.createReadStream('test.jpg'));
    form.append('quality', '80');

    const response = await fetch('http://localhost:3000/api/compress', {
        method: 'POST',
        body: form
    });

    const data = await response.json();
    console.log(data);
}

testAPI();
```

---

## 常见问题

### Q: curl 命令报错 "Failed to connect"
**A:** 确保服务器正在运行：`npm start`

### Q: 上传文件失败
**A:** 检查文件路径是否正确，使用 `@` 符号指定文件：`-F "images=@./path/to/image.jpg"`

### Q: 响应是 HTML 而不是 JSON
**A:** 可能访问了错误的 URL，确保使用 `/api/compress` 而不是 `/compress`

### Q: 图片下载后无法打开
**A:** 检查 Content-Type 和文件扩展名是否匹配

---

## 性能测试

### 测试压缩速度

```bash
# 使用 time 命令测量时间
time curl -X POST http://localhost:3000/api/compress \
  -F "images=@test.jpg" \
  -F "quality=80"
```

### 测试并发请求

```bash
# 使用 Apache Bench
ab -n 10 -c 2 -p post_data.txt -T multipart/form-data \
  http://localhost:3000/api/compress

# 或使用 hey
hey -n 10 -c 2 -m POST \
  -D post_data.txt \
  http://localhost:3000/api/compress
```

---

## 总结

现在你可以：
1. ✅ 使用自动化脚本快速测试所有 API
2. ✅ 使用 curl 命令手动测试特定场景
3. ✅ 在浏览器中实时监控 API 调用
4. ✅ 使用 Postman 进行可视化测试
5. ✅ 编写自定义测试脚本

开始测试吧！🚀
