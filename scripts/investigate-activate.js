const { chromium } = require('playwright');

async function investigateActivation() {
  console.log('🔍 开始调研 mujicard.com 的激活流程...\n');

  // 启动浏览器
  const browser = await chromium.launch({
    headless: false, // 显示浏览器窗口以便观察
    slowMo: 500 // 减慢操作速度以便观察
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // 存储捕获的请求
  const capturedRequests = [];
  const capturedResponses = [];

  // 监听所有网络请求
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    
    // 只记录 API 相关的请求
    if (url.includes('api') || url.includes('card') || url.includes('activate')) {
      const requestInfo = {
        url: url,
        method: method,
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      };
      
      capturedRequests.push(requestInfo);
      
      console.log(`\n📤 请求: ${method} ${url}`);
      if (requestInfo.postData) {
        console.log(`   Body: ${requestInfo.postData}`);
      }
    }
  });

  // 监听所有网络响应
  page.on('response', async response => {
    const url = response.url();
    const status = response.status();
    
    // 只记录 API 相关的响应
    if (url.includes('api') || url.includes('card') || url.includes('activate')) {
      try {
        const body = await response.text();
        
        const responseInfo = {
          url: url,
          status: status,
          headers: response.headers(),
          body: body,
          timestamp: new Date().toISOString()
        };
        
        capturedResponses.push(responseInfo);
        
        console.log(`\n📥 响应: ${status} ${url}`);
        
        // 尝试解析 JSON
        try {
          const jsonBody = JSON.parse(body);
          console.log(`   Data:`, JSON.stringify(jsonBody, null, 2));
        } catch (e) {
          console.log(`   Body (非JSON): ${body.substring(0, 200)}...`);
        }
      } catch (e) {
        console.log(`   无法读取响应体: ${e.message}`);
      }
    }
  });

  try {
    console.log('\n📍 步骤 1: 访问激活页面...');
    await page.goto('https://mujicard.com/activate', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ 页面加载完成\n');

    // 等待页面完全加载
    await page.waitForTimeout(2000);

    console.log('📍 步骤 2: 查找输入框...');
    
    // 尝试多种选择器查找输入框
    const inputSelectors = [
      'input[type="text"]',
      'input[placeholder*="卡密"]',
      'input[placeholder*="ID"]',
      'input',
      'textarea'
    ];

    let inputElement = null;
    for (const selector of inputSelectors) {
      try {
        inputElement = await page.$(selector);
        if (inputElement) {
          console.log(`✅ 找到输入框: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!inputElement) {
      console.log('⚠️  未找到输入框，尝试截图...');
      await page.screenshot({ path: 'scripts/page-screenshot.png', fullPage: true });
      console.log('📸 截图已保存到 scripts/page-screenshot.png');
      
      // 打印页面 HTML 结构
      const html = await page.content();
      console.log('\n📄 页面 HTML 结构（前 1000 字符）:');
      console.log(html.substring(0, 1000));
    } else {
      console.log('\n📍 步骤 3: 输入卡密...');
      const cardId = 'mio-bc5ae8cc-0ea7-4766-8e68-16e434bde0ef';
      await inputElement.fill(cardId);
      console.log(`✅ 已输入卡密: ${cardId}`);

      await page.waitForTimeout(1000);

      console.log('\n📍 步骤 4: 查找并点击按钮...');

      // 获取所有按钮并打印
      const allButtons = await page.$$('button');
      console.log(`找到 ${allButtons.length} 个按钮`);

      for (let i = 0; i < allButtons.length; i++) {
        const btn = allButtons[i];
        const text = await btn.textContent();
        const isVisible = await btn.isVisible();
        console.log(`  按钮 ${i + 1}: "${text?.trim()}" (可见: ${isVisible})`);
      }

      // 尝试使用 Playwright 的文本选择器
      let buttonElement = null;
      try {
        // 等待包含"获取"文本的按钮
        buttonElement = await page.getByRole('button', { name: /获取|查询|激活|提交/i });
        if (buttonElement) {
          const buttonText = await buttonElement.textContent();
          console.log(`✅ 找到按钮: "${buttonText}"`);
        }
      } catch (e) {
        console.log('⚠️  未找到匹配的按钮，尝试其他方法...');

        // 尝试查找表单提交按钮
        try {
          buttonElement = await page.$('form button[type="submit"]');
          if (!buttonElement) {
            buttonElement = await page.$('form button');
          }
          if (buttonElement) {
            const buttonText = await buttonElement.textContent();
            console.log(`✅ 找到表单按钮: "${buttonText}"`);
          }
        } catch (e2) {
          console.log('⚠️  未找到表单按钮');
        }
      }

      if (buttonElement) {
        console.log('\n📍 步骤 5: 点击按钮...');
        try {
          await buttonElement.click({ timeout: 5000 });
          console.log('✅ 已点击按钮');

          // 等待网络请求完成
          console.log('\n⏳ 等待网络请求...');
          await page.waitForTimeout(5000);
        } catch (e) {
          console.log(`❌ 点击失败: ${e.message}`);
        }
      } else {
        console.log('⚠️  未找到合适的按钮');
      }
    }

    // 截图保存最终状态
    await page.screenshot({ path: 'scripts/final-screenshot.png', fullPage: true });
    console.log('\n📸 最终截图已保存到 scripts/final-screenshot.png');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    await page.screenshot({ path: 'scripts/error-screenshot.png', fullPage: true });
    console.log('📸 错误截图已保存到 scripts/error-screenshot.png');
  }

  // 等待一段时间以便观察
  console.log('\n⏳ 等待 5 秒以便观察...');
  await page.waitForTimeout(5000);

  await browser.close();

  // 输出总结
  console.log('\n' + '='.repeat(80));
  console.log('📊 调研总结');
  console.log('='.repeat(80));

  console.log(`\n📤 捕获的请求数量: ${capturedRequests.length}`);
  if (capturedRequests.length > 0) {
    console.log('\n详细请求列表:');
    capturedRequests.forEach((req, index) => {
      console.log(`\n${index + 1}. ${req.method} ${req.url}`);
      console.log(`   时间: ${req.timestamp}`);
      console.log(`   Headers:`, JSON.stringify(req.headers, null, 2));
      if (req.postData) {
        console.log(`   Body: ${req.postData}`);
      }
    });
  }

  console.log(`\n📥 捕获的响应数量: ${capturedResponses.length}`);
  if (capturedResponses.length > 0) {
    console.log('\n详细响应列表:');
    capturedResponses.forEach((res, index) => {
      console.log(`\n${index + 1}. ${res.status} ${res.url}`);
      console.log(`   时间: ${res.timestamp}`);
      console.log(`   Body: ${res.body.substring(0, 500)}...`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ 调研完成！');
  console.log('='.repeat(80));
}

// 运行调研
investigateActivation().catch(console.error);

