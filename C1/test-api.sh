#!/bin/bash

# 图片压缩 API 测试脚本
# 使用方法: ./test-api.sh

echo "========================================"
echo "图片压缩工具 API 测试"
echo "========================================"
echo ""

# 设置颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 服务器地址
API_BASE="http://localhost:3000"

# 创建测试目录
TEST_DIR="test_results"
mkdir -p $TEST_DIR

echo -e "${BLUE}[1/5] 检查服务器状态...${NC}"
if curl -s $API_BASE > /dev/null; then
    echo -e "${GREEN}✓ 服务器正在运行${NC}"
else
    echo -e "${RED}✗ 服务器未启动，请先运行 npm start${NC}"
    exit 1
fi
echo ""

# 创建测试图片（使用 ImageMagick 或者跳过）
echo -e "${BLUE}[2/5] 准备测试图片...${NC}"
echo -e "${YELLOW}提示: 请将测试图片放在当前目录，命名为 test.jpg 或 test.png${NC}"
echo -e "${YELLOW}或者使用任意图片文件进行测试${NC}"
echo ""

# 查找当前目录的图片文件
IMAGE_FILE=""
for ext in jpg jpeg png webp gif JPG JPEG PNG WEBP GIF; do
    if [ -f "test.$ext" ]; then
        IMAGE_FILE="test.$ext"
        break
    fi
done

if [ -z "$IMAGE_FILE" ]; then
    # 查找任意图片
    IMAGE_FILE=$(find . -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -print -quit)
fi

if [ -z "$IMAGE_FILE" ]; then
    echo -e "${RED}✗ 未找到测试图片文件${NC}"
    echo -e "${YELLOW}请在当前目录放置一个图片文件（test.jpg 或任意 .jpg/.png 文件）${NC}"
    exit 1
else
    echo -e "${GREEN}✓ 找到测试图片: $IMAGE_FILE${NC}"
    IMAGE_SIZE=$(du -h "$IMAGE_FILE" | cut -f1)
    echo -e "  文件大小: $IMAGE_SIZE"
fi
echo ""

# 测试 1: 压缩图片 API
echo -e "${BLUE}[3/5] 测试图片压缩 API (POST /api/compress)...${NC}"
RESPONSE=$(curl -s -X POST $API_BASE/api/compress \
    -F "images=@$IMAGE_FILE" \
    -F "quality=80")

echo "$RESPONSE" > $TEST_DIR/compress_response.json

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ 压缩成功${NC}"
    echo ""
    echo "响应数据:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

    # 提取预览和下载 URL
    PREVIEW_URL=$(echo "$RESPONSE" | grep -o '"/api/preview/[^"]*' | head -1 | tr -d '"')
    DOWNLOAD_URL=$(echo "$RESPONSE" | grep -o '"/api/download/[^"]*' | head -1 | tr -d '"')

    echo ""
    echo -e "${GREEN}提取到的 URL:${NC}"
    echo "  预览: $PREVIEW_URL"
    echo "  下载: $DOWNLOAD_URL"
else
    echo -e "${RED}✗ 压缩失败${NC}"
    echo "$RESPONSE"
    exit 1
fi
echo ""

# 测试 2: 预览图片 API
if [ ! -z "$PREVIEW_URL" ]; then
    echo -e "${BLUE}[4/5] 测试图片预览 API (GET $PREVIEW_URL)...${NC}"
    HTTP_CODE=$(curl -s -o $TEST_DIR/preview_image.jpg -w "%{http_code}" $API_BASE$PREVIEW_URL)

    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ 预览成功${NC}"
        PREVIEW_SIZE=$(du -h "$TEST_DIR/preview_image.jpg" | cut -f1)
        echo "  保存位置: $TEST_DIR/preview_image.jpg"
        echo "  文件大小: $PREVIEW_SIZE"
    else
        echo -e "${RED}✗ 预览失败 (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${YELLOW}⊘ 跳过预览测试（未获取到 URL）${NC}"
fi
echo ""

# 测试 3: 下载图片 API
if [ ! -z "$DOWNLOAD_URL" ]; then
    echo -e "${BLUE}[5/5] 测试图片下载 API (GET $DOWNLOAD_URL)...${NC}"
    HTTP_CODE=$(curl -s -o $TEST_DIR/downloaded_image.jpg -w "%{http_code}" $API_BASE$DOWNLOAD_URL)

    if [ "$HTTP_CODE" == "200" ]; then
        echo -e "${GREEN}✓ 下载成功${NC}"
        DOWNLOAD_SIZE=$(du -h "$TEST_DIR/downloaded_image.jpg" | cut -f1)
        echo "  保存位置: $TEST_DIR/downloaded_image.jpg"
        echo "  文件大小: $DOWNLOAD_SIZE"
    else
        echo -e "${RED}✗ 下载失败 (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${YELLOW}⊘ 跳过下载测试（未获取到 URL）${NC}"
fi
echo ""

# 总结
echo "========================================"
echo -e "${GREEN}测试完成！${NC}"
echo "========================================"
echo ""
echo "测试结果保存在: $TEST_DIR/"
echo ""
echo "文件对比:"
echo "  原始图片: $IMAGE_FILE ($IMAGE_SIZE)"
if [ -f "$TEST_DIR/downloaded_image.jpg" ]; then
    echo "  压缩图片: $TEST_DIR/downloaded_image.jpg ($DOWNLOAD_SIZE)"

    # 计算压缩比
    ORIGINAL_BYTES=$(stat -f%z "$IMAGE_FILE" 2>/dev/null || stat -c%s "$IMAGE_FILE" 2>/dev/null)
    COMPRESSED_BYTES=$(stat -f%z "$TEST_DIR/downloaded_image.jpg" 2>/dev/null || stat -c%s "$TEST_DIR/downloaded_image.jpg" 2>/dev/null)

    if [ ! -z "$ORIGINAL_BYTES" ] && [ ! -z "$COMPRESSED_BYTES" ]; then
        RATIO=$(echo "scale=2; (1 - $COMPRESSED_BYTES / $ORIGINAL_BYTES) * 100" | bc)
        echo "  压缩率: ${RATIO}%"
    fi
fi
echo ""
echo "你可以打开 $TEST_DIR/downloaded_image.jpg 查看压缩后的图片"
