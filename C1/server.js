const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 创建必要的目录
const uploadsDir = path.join(__dirname, 'uploads');
const compressedDir = path.join(__dirname, 'compressed');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir);
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 限制
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持图片格式 (JPEG, PNG, WebP, GIF)'));
    }
  }
});

// 压缩图片的函数
async function compressImage(inputPath, outputPath, quality) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  let compressedImage = image;

  // 根据图片格式选择合适的压缩策略
  if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
    compressedImage = compressedImage.jpeg({ quality: quality, progressive: true });
  } else if (metadata.format === 'png') {
    // PNG 使用压缩级别 (quality 转换为 0-9 的压缩级别)
    const compressionLevel = Math.floor((100 - quality) / 11);
    compressedImage = compressedImage.png({ compressionLevel: Math.min(compressionLevel, 9), progressive: true });
  } else if (metadata.format === 'webp') {
    compressedImage = compressedImage.webp({ quality: quality });
  } else {
    // 其他格式转换为 JPEG
    compressedImage = compressedImage.jpeg({ quality: quality, progressive: true });
  }

  await compressedImage.toFile(outputPath);
}

// 图片上传和压缩接口
app.post('/api/compress', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '请上传图片文件' });
    }

    const quality = parseInt(req.body.quality) || 80;
    const results = [];

    for (const file of req.files) {
      const inputPath = file.path;
      const outputFilename = 'compressed-' + file.filename;
      const outputPath = path.join(compressedDir, outputFilename);

      // 获取原始文件信息
      const originalStats = fs.statSync(inputPath);
      const originalMetadata = await sharp(inputPath).metadata();

      // 压缩图片
      await compressImage(inputPath, outputPath, quality);

      // 获取压缩后文件信息
      const compressedStats = fs.statSync(outputPath);
      const compressedMetadata = await sharp(outputPath).metadata();

      const compressionRatio = ((1 - compressedStats.size / originalStats.size) * 100).toFixed(2);

      results.push({
        originalName: file.originalname,
        originalSize: originalStats.size,
        originalWidth: originalMetadata.width,
        originalHeight: originalMetadata.height,
        compressedSize: compressedStats.size,
        compressedWidth: compressedMetadata.width,
        compressedHeight: compressedMetadata.height,
        compressionRatio: compressionRatio,
        downloadUrl: `/api/download/${outputFilename}`,
        previewUrl: `/api/preview/${outputFilename}`
      });

      // 删除原始上传文件
      fs.unlinkSync(inputPath);
    }

    res.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('压缩错误:', error);
    res.status(500).json({ error: '图片压缩失败: ' + error.message });
  }
});

// 预览压缩后的图片
app.get('/api/preview/:filename', (req, res) => {
  const filePath = path.join(compressedDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: '文件不存在' });
  }
});

// 下载压缩后的图片
app.get('/api/download/:filename', (req, res) => {
  const filePath = path.join(compressedDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, req.params.filename.replace('compressed-', ''));
  } else {
    res.status(404).json({ error: '文件不存在' });
  }
});

// 清理旧文件的定时任务（每小时执行一次）
setInterval(() => {
  const now = Date.now();
  const maxAge = 3600000; // 1 小时

  [uploadsDir, compressedDir].forEach(dir => {
    fs.readdir(dir, (err, files) => {
      if (err) return;

      files.forEach(file => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;

          if (now - stats.mtime.getTime() > maxAge) {
            fs.unlink(filePath, err => {
              if (err) console.error('删除文件失败:', err);
            });
          }
        });
      });
    });
  });
}, 3600000);

app.listen(PORT, () => {
  console.log(`图片压缩服务器运行在 http://localhost:${PORT}`);
});
