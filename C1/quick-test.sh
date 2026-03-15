#!/bin/bash

# 快速测试脚本 - 需要准备一个名为 test.jpg 的图片文件

echo "=========================================="
echo "快速 API 测试"
echo "=========================================="
echo ""

# 检查测试图片是否存在
if [ ! -f "test.jpg" ] && [ ! -f "test.png" ]; then
    echo "❌ 请在当前目录放置一个测试图片（test.jpg 或 test.png）"
    exit 1
fi

TEST_IMAGE="test.jpg"
[ -f "test.png" ] && TEST_IMAGE="test.png"

echo "✓ 使用测试图片: $TEST_IMAGE"
echo ""

# 测试 1: 压缩图片
echo "📤 测试 1: 压缩图片 (POST /api/compress)"
echo "命令: curl -X POST http://localhost:3000/api/compress -F images=@$TEST_IMAGE -F quality=80"
echo ""

curl -X POST http://localhost:3000/api/compress \
  -F "images=@$TEST_IMAGE" \
  -F "quality=80" \
  | python3 -m json.tool

echo ""
echo ""
echo "=========================================="
echo "💡 提示："
echo "1. 复制上面响应中的 previewUrl 或 downloadUrl"
echo "2. 运行以下命令测试预览/下载："
echo ""
echo "   # 预览图片"
echo "   curl http://localhost:3000/api/preview/compressed-xxx.jpg -o preview.jpg"
echo ""
echo "   # 下载图片"
echo "   curl http://localhost:3000/api/download/compressed-xxx.jpg -o download.jpg"
echo "=========================================="
