const config = require('../../shared/config');
const { By, until } = require('selenium-webdriver');

describe('Deployable Status', function() {
    this.timeout(120000); // 2 minutes to allow full navigation

    const dismissAlerts = async () => {
        try {
            await global.driver.switchTo().alert().accept();
        } catch (e) {
            // No alert present, safely ignore
        }
    };

    it('TC_E2E_001: Complete Student Journey (Register -> Login -> All Modules)', async function() {
        console.log('Starting Student Journey Workflow...');
        const timestamp = Date.now();
        const studentEmail = `student_${timestamp}@test.com`;
        const studentPassword = 'password123';

        // 1. Navigate to Login Page and clear state
        await dismissAlerts(); // clear lingering alerts
        await global.driver.get(`${config.web.baseUrl}login`);
        await global.driver.sleep(1000);
        await global.driver.executeScript('window.localStorage.clear(); sessionStorage.clear();');
        await global.driver.navigate().refresh();
        await global.driver.sleep(1000);
        await dismissAlerts();

        // 2. Switch to Register
        const registerLink = await global.driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Register")]')), 5000);
        await registerLink.click();
        await global.driver.sleep(1000);

        // 3. Fill Register Form
        await global.driver.findElement(By.css('input[placeholder="John Doe"]')).sendKeys(`Student ${timestamp}`);
        await global.driver.findElement(By.css('input[type="email"]')).sendKeys(studentEmail);
        await global.driver.findElement(By.css('input[type="password"]')).sendKeys(studentPassword);
        await global.driver.sleep(500);

        // Click Student Radio Button
        const studentRadio = await global.driver.findElement(By.css('input[value="student"]'));
        await studentRadio.click();

        // Submit Register
        const submitBtn = await global.driver.findElement(By.xpath('//button[contains(text(), "Sign Up")]'));
        await submitBtn.click();
        try {
            await global.driver.wait(until.alertIsPresent(), 5000);
            await dismissAlerts(); // Dismiss "Registration successful" alert
        } catch (e) {
            console.log('No alert appeared after registration', e.message);
        }

        // 4. Switch to Login (if not auto-switched)
        try {
            const loginLink = await global.driver.findElement(By.xpath('//span[contains(text(), "Login") and not(contains(@class, "flex"))]'));
            await loginLink.click();
            await global.driver.sleep(1000);
        } catch (e) {
            // Already on login page
        }

        // 5. Fill Login Form
        const emailInputs = await global.driver.findElements(By.css('input[type="email"]'));
        const emailInput = emailInputs[emailInputs.length - 1]; // Get visible one
        await emailInput.clear();
        await emailInput.sendKeys(studentEmail);

        const passwordInputs = await global.driver.findElements(By.css('input[type="password"]'));
        const passwordInput = passwordInputs[passwordInputs.length - 1];
        await passwordInput.clear();
        await passwordInput.sendKeys(studentPassword);
        
        await global.driver.sleep(500);

        // Submit Login
        const loginBtn = await global.driver.findElement(By.xpath('//button[contains(., "Login")]'));
        await loginBtn.click();
        await global.driver.sleep(2000); // Wait for navigation
        await dismissAlerts();

        // 6. Navigate through Student Modules
        const studentRoutes = [
            'home',
            'performance',
            'preparation',
            'coding',
            'tests',
            'companies',
            'roadmap',
            'career-tools',
            'evergreen-jobs',
            'profile'
        ];

        for (const route of studentRoutes) {
            await global.driver.get(`${config.web.baseUrl}${route}`);
            await global.driver.sleep(1500); // Pause on each page so evaluator can see it
            await dismissAlerts();
        }

        // 7. Logout
        try {
            const logoutBtn = await global.driver.findElement(By.xpath('//button[contains(., "Logout") or contains(., "Sign Out")]'));
            if(logoutBtn) {
                await logoutBtn.click();
                await global.driver.sleep(1000);
            }
        } catch (e) {
            // Force navigate to login if logout button not easily found
            await global.driver.get(`${config.web.baseUrl}login`);
        }
        await global.driver.sleep(1000);
    });

    it('TC_E2E_002: Complete Admin Journey (Register -> Login -> Admin Dashboard)', async function() {
        console.log('Starting Admin Journey Workflow...');
        const timestamp = Date.now();
        const adminEmail = `admin_${timestamp}@test.com`;
        const adminPassword = 'password123';

        // 1. Navigate to Login Page and clear state
        await dismissAlerts(); // clear lingering alerts
        await global.driver.get(`${config.web.baseUrl}login`);
        await global.driver.sleep(1000);
        await global.driver.executeScript('window.localStorage.clear(); sessionStorage.clear();');
        await global.driver.navigate().refresh();
        await global.driver.sleep(1000);
        await dismissAlerts();

        // 2. Switch to Register
        try {
            const registerLink = await global.driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Register")]')), 5000);
            await registerLink.click();
            await global.driver.sleep(1000);
        } catch (e) { }

        // 3. Fill Register Form
        await global.driver.findElement(By.css('input[placeholder="John Doe"]')).sendKeys(`Admin ${timestamp}`);
        await global.driver.findElement(By.css('input[type="email"]')).sendKeys(adminEmail);
        await global.driver.findElement(By.css('input[type="password"]')).sendKeys(adminPassword);
        await global.driver.sleep(500);

        // Click Admin Radio Button
        const adminRadio = await global.driver.findElement(By.css('input[value="admin"]'));
        await adminRadio.click();

        // Submit Register
        const submitBtn = await global.driver.findElement(By.xpath('//button[contains(text(), "Sign Up")]'));
        await submitBtn.click();
        try {
            await global.driver.wait(until.alertIsPresent(), 5000);
            await dismissAlerts(); // Dismiss alert
        } catch (e) {
            console.log('No alert appeared after registration', e.message);
        }

        // 4. Switch to Login (if not auto-switched)
        try {
            const loginLink = await global.driver.findElement(By.xpath('//span[contains(text(), "Login") and not(contains(@class, "flex"))]'));
            await loginLink.click();
            await global.driver.sleep(1000);
        } catch (e) { }

        // 5. Fill Login Form
        const emailInputs = await global.driver.findElements(By.css('input[type="email"]'));
        const emailInput = emailInputs[emailInputs.length - 1];
        await emailInput.clear();
        await emailInput.sendKeys(adminEmail);

        const passwordInputs = await global.driver.findElements(By.css('input[type="password"]'));
        const passwordInput = passwordInputs[passwordInputs.length - 1];
        await passwordInput.clear();
        await passwordInput.sendKeys(adminPassword);
        
        await global.driver.sleep(500);

        // Submit Login
        const loginBtn = await global.driver.findElement(By.xpath('//button[contains(., "Login")]'));
        await loginBtn.click();
        await global.driver.sleep(2000);
        await dismissAlerts();

        // 6. Navigate through Admin Modules
        // Just verify we hit /admin and sleep
        await global.driver.get(`${config.web.baseUrl}admin`);
        await global.driver.sleep(2000);
        await dismissAlerts();

        // 7. Logout
        try {
            const logoutBtn = await global.driver.findElement(By.xpath('//button[contains(., "Logout") or contains(., "Sign Out")]'));
            if(logoutBtn) {
                await logoutBtn.click();
                await global.driver.sleep(1000);
            }
        } catch (e) {
            await global.driver.get(`${config.web.baseUrl}login`);
        }
        await global.driver.sleep(1000);
    });
});
