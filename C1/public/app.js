// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const qualityBtns = document.querySelectorAll('.quality-btn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const clearBtn = document.getElementById('clearBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// 状态管理
let selectedFiles = [];
let compressionResults = [];
let currentQuality = 80;

// 初始化事件监听器
function init() {
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', () => fileInput.click());
    selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    // 文件选择
    fileInput.addEventListener('change', handleFileSelect);

    // 拖放功能
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // 质量控制
    qualitySlider.addEventListener('input', handleQualityChange);
    qualityBtns.forEach(btn => {
        btn.addEventListener('click', handleQualityBtnClick);
    });

    // 清空结果
    clearBtn.addEventListener('click', clearResults);

    // 批量下载
    downloadAllBtn.addEventListener('click', downloadAll);
}

// 处理拖放
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
        alert('请上传图片文件');
        return;
    }

    processFiles(imageFiles);
}

// 处理文件选择
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    processFiles(files);
}

// 处理质量滑块变化
function handleQualityChange(e) {
    currentQuality = parseInt(e.target.value);
    qualityValue.textContent = currentQuality + '%';

    // 取消所有质量按钮的激活状态
    qualityBtns.forEach(btn => btn.classList.remove('active'));
}

// 处理质量按钮点击
function handleQualityBtnClick(e) {
    const quality = parseInt(e.target.dataset.quality);
    currentQuality = quality;
    qualitySlider.value = quality;
    qualityValue.textContent = quality + '%';

    // 更新按钮激活状态
    qualityBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
}

// 处理文件并上传压缩
async function processFiles(files) {
    if (files.length === 0) return;

    selectedFiles = files;
    showLoading();

    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });
    formData.append('quality', currentQuality);

    try {
        const response = await fetch('/api/compress', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('压缩失败');
        }

        const data = await response.json();

        if (data.success) {
            compressionResults = data.results;
            displayResults();
        } else {
            alert('压缩失败: ' + (data.error || '未知错误'));
        }
    } catch (error) {
        console.error('错误:', error);
        alert('压缩失败: ' + error.message);
    } finally {
        hideLoading();
        fileInput.value = '';
    }
}

// 显示加载动画
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

// 隐藏加载动画
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// 显示压缩结果
function displayResults() {
    resultsContainer.innerHTML = '';

    compressionResults.forEach((result, index) => {
        const resultCard = createResultCard(result, index);
        resultsContainer.appendChild(resultCard);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 创建结果卡片
function createResultCard(result, index) {
    const card = document.createElement('div');
    card.className = 'result-card';

    const originalSizeKB = (result.originalSize / 1024).toFixed(2);
    const compressedSizeKB = (result.compressedSize / 1024).toFixed(2);

    card.innerHTML = `
        <div class="result-header">
            <div class="result-filename">${escapeHtml(result.originalName)}</div>
            <div class="compression-badge">压缩 ${result.compressionRatio}%</div>
        </div>
        <div class="result-body">
            <div class="image-comparison">
                <div class="image-box">
                    <div class="image-label">原图</div>
                    <img src="${result.previewUrl}" alt="原图" loading="lazy">
                </div>
                <div class="image-info">
                    <div class="info-row">
                        <span class="info-label">尺寸</span>
                        <span class="info-value">${result.originalWidth} × ${result.originalHeight}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">大小</span>
                        <span class="info-value">${originalSizeKB} KB</span>
                    </div>
                </div>
            </div>
            <div class="image-comparison">
                <div class="image-box">
                    <div class="image-label">压缩后</div>
                    <img src="${result.previewUrl}" alt="压缩后" loading="lazy">
                </div>
                <div class="image-info">
                    <div class="info-row">
                        <span class="info-label">尺寸</span>
                        <span class="info-value">${result.compressedWidth} × ${result.compressedHeight}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">大小</span>
                        <span class="info-value size-reduced">${compressedSizeKB} KB</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">节省</span>
                        <span class="info-value size-reduced">${(originalSizeKB - compressedSizeKB).toFixed(2)} KB</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="result-actions">
            <button class="btn-download" onclick="downloadImage('${result.downloadUrl}', '${escapeHtml(result.originalName)}')">
                下载图片
            </button>
        </div>
    `;

    return card;
}

// 下载单个图片
function downloadImage(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 批量下载所有图片
async function downloadAll() {
    if (compressionResults.length === 0) return;

    for (const result of compressionResults) {
        await new Promise(resolve => {
            downloadImage(result.downloadUrl, result.originalName);
            setTimeout(resolve, 300); // 延迟避免浏览器阻止多个下载
        });
    }
}

// 清空结果
function clearResults() {
    compressionResults = [];
    resultsContainer.innerHTML = '';
    resultsSection.style.display = 'none';
}

// HTML 转义函数（防止 XSS）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 初始化应用
init();
