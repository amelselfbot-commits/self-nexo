document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('configForm');
    const resultDiv = document.getElementById('result');
    const resetBtn = document.getElementById('resetBtn');
    const generateUuidBtn = document.getElementById('generateUuid');
    const uuidInput = document.getElementById('uuid');
    const copyLinkBtn = document.getElementById('copyLink');
    const copyJsonBtn = document.getElementById('copyJson');

    // تولید UUID خودکار
    generateUuidBtn.addEventListener('click', () => {
        const uuid = crypto.randomUUID ? crypto.randomUUID() : 
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        uuidInput.value = uuid;
    });

    // تولید کانفیگ
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const server = document.getElementById('serverAddress').value.trim();
        const uuid = document.getElementById('uuid').value.trim();
        const wsPath = document.getElementById('wsPath').value.trim() || '/v2ray';
        const port = document.getElementById('port').value || '443';
        const tls = document.getElementById('tls').value === 'true';
        const name = document.getElementById('configName').value.trim() || 'My V2Ray';

        if (!server || !uuid) {
            alert('لطفاً آدرس سرور و UUID را وارد کن.');
            return;
        }

        // ساخت کانفیگ JSON
        const config = {
            v: '2',
            ps: name,
            add: server,
            port: parseInt(port),
            id: uuid,
            aid: '0',
            net: 'ws',
            type: 'none',
            host: '',
            path: wsPath,
            tls: tls ? 'tls' : '',
            sni: '',
            alpn: '',
            fp: 'chrome'
        };

        // تبدیل به VMess URL (برای V2RayNG / Nekoray)
        // فرمت: vmess://base64(json)
        const vmessJson = JSON.stringify(config);
        const vmessBase64 = btoa(unescape(encodeURIComponent(vmessJson)));
        const vmessLink = `vmess://${vmessBase64}`;

        // نمایش
        document.getElementById('configLink').value = vmessLink;
        document.getElementById('configJson').textContent = JSON.stringify(config, null, 2);

        form.style.display = 'none';
        resultDiv.style.display = 'block';
    });

    // کپی لینک
    copyLinkBtn.addEventListener('click', () => {
        const input = document.getElementById('configLink');
        input.select();
        navigator.clipboard?.writeText(input.value);
        copyLinkBtn.textContent = '✅ کپی شد';
        setTimeout(() => copyLinkBtn.textContent = '📋 کپی', 2000);
    });

    // کپی JSON
    copyJsonBtn.addEventListener('click', () => {
        const text = document.getElementById('configJson').textContent;
        navigator.clipboard?.writeText(text);
        copyJsonBtn.textContent = '✅ کپی شد';
        setTimeout(() => copyJsonBtn.textContent = '📋 کپی JSON', 2000);
    });

    // ریست
    resetBtn.addEventListener('click', () => {
        resultDiv.style.display = 'none';
        form.style.display = 'block';
        form.reset();
    });

    // تولید UUID اولیه (اختیاری)
    generateUuidBtn.click();
});