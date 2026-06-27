"""
Playwright script to navigate through www.worldcuptracker.us
with OBS Studio screen recording.

Launches OBS with --startrecording, navigates the site via Playwright,
then stops OBS. Video is saved to C:\\Users\\jtom\\Videos.
"""

import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

URL = "https://www.worldcuptracker.us"
OBS_PATH = r"C:\Program Files\obs-studio\bin\64bit\obs64.exe"


def is_obs_running():
    result = subprocess.run(
        ["tasklist", "/FI", "IMAGENAME eq obs64.exe"],
        capture_output=True, text=True
    )
    return "obs64.exe" in result.stdout.lower()


def start_obs_recording():
    if is_obs_running():
        print("[OBS] OBS is already running - killing it first...")
        subprocess.run(["taskkill", "/IM", "obs64.exe", "/F"], capture_output=True)
        time.sleep(3)

    print("[OBS] Launching OBS with auto-recording...")
    obs_dir = os.path.dirname(OBS_PATH)
    subprocess.Popen(
        [OBS_PATH, "--startrecording", "--minimize-to-tray", "--disable-updater"],
        cwd=obs_dir,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    for i in range(30):
        if is_obs_running():
            print(f"[OBS] OBS started (took ~{i+1}s)")
            break
        time.sleep(1)
    else:
        raise RuntimeError("OBS failed to start within 30 seconds")

    print("[OBS] Giving OBS time to initialize and start recording...")
    time.sleep(8)
    print("[OBS] Recording should be active now.")


def stop_obs_recording():
    print("[OBS] Stopping OBS gracefully (saving recording)...")
    subprocess.run(["taskkill", "/IM", "obs64.exe"], capture_output=True)
    for i in range(15):
        time.sleep(1)
        if not is_obs_running():
            print(f"[OBS] OBS closed cleanly after ~{i+1}s.")
            print("[OBS] Video saved to C:\\Users\\jtom\\Videos")
            return
        if i % 5 == 4:
            print(f"[OBS] Still closing... ({i+1}s)")
    print("[OBS] Graceful close timed out, force-killing...")
    subprocess.run(["taskkill", "/IM", "obs64.exe", "/F"], capture_output=True)
    time.sleep(2)
    print("[OBS] OBS force-closed. Video may be in C:\\Users\\jtom\\Videos")


async def screenshot(page, name):
    path = f"screenshots/{name}.png"
    await page.screenshot(path=path, full_page=True)
    print(f"  -> Screenshot saved: {path}")


async def navigate(page, context):
    # ── 1. Load homepage ──────────────────────────────────────────
    print("[1] Loading homepage...")
    await page.goto(URL, wait_until="networkidle")
    await page.wait_for_timeout(2000)
    await screenshot(page, "01_homepage")

    # ── 1b. Dismiss cookie consent banner if visible ───────────────
    cookie_accept = page.locator("button").filter(has_text="Accept All")
    if await cookie_accept.count() > 0:
        print("  -> Dismissing cookie consent banner...")
        await cookie_accept.first.click()
        await page.wait_for_timeout(500)

    # ── 2. Toggle dark/light theme ────────────────────────────────
    print("[2] Toggling theme to light mode...")
    theme_btn = page.locator("button").filter(has_text="☀️").or_(
        page.locator("button").filter(has_text="🌙")
    )
    await theme_btn.first.click()
    await page.wait_for_timeout(800)
    await screenshot(page, "02_theme_toggled")

    await theme_btn.first.click()
    await page.wait_for_timeout(500)

    # ── 3. Toggle 12h / 24h clock ────────────────────────────────
    print("[3] Toggling clock format...")
    clock_btn = page.locator("button").filter(has_text="12h").or_(
        page.locator("button").filter(has_text="24h")
    )
    await clock_btn.first.click()
    await page.wait_for_timeout(500)
    await screenshot(page, "03_clock_toggled")

    # ── 4. Toggle auto-refresh ────────────────────────────────────
    print("[4] Toggling auto-refresh...")
    auto_btn = page.locator("button").filter(has_text="Auto")
    await auto_btn.first.click()
    await page.wait_for_timeout(500)
    await screenshot(page, "04_auto_refresh_toggled")
    await auto_btn.first.click()
    await page.wait_for_timeout(300)

    # ── 5. Click each timezone selector (ET, CT, MT, PT) ─────────
    print("[5] Clicking timezone selectors...")
    for tz in ["ET", "CT", "MT", "PT"]:
        tz_btn = page.locator(f"button:text-is('{tz}')")
        if await tz_btn.count() > 0:
            await tz_btn.first.click()
            await page.wait_for_timeout(400)
            print(f"  -> Selected timezone: {tz}")
    await screenshot(page, "05_timezone_PT")

    await page.locator("button:text-is('PT')").first.click()
    await page.wait_for_timeout(300)

    # ── 6. Click manual refresh button ────────────────────────────
    print("[6] Clicking manual refresh...")
    refresh_btn = page.locator("button[title='Manually refresh data']")
    if await refresh_btn.count() > 0:
        await refresh_btn.first.click()
        await page.wait_for_timeout(1000)
    await screenshot(page, "06_after_refresh")

    # ── 7. Navigate to Groups tab ─────────────────────────────────
    print("[7] Switching to Groups tab...")
    groups_tab = page.locator("div").filter(has_text="Groups").last
    await groups_tab.click()
    await page.wait_for_timeout(1500)
    await screenshot(page, "07_groups_tab")

    # ── 8. Click a team in the Groups view to open Squad Modal ────
    print("[8] Clicking a team to open squad modal...")
    team_clickable = page.locator("[style*='cursor: pointer'] img, [style*='cursor:pointer'] img, td img")
    if await team_clickable.count() > 0:
        await team_clickable.first.click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "08_squad_modal")

        close_btn = page.locator("button").filter(has_text="✕").or_(
            page.locator("button").filter(has_text="×")
        ).or_(page.locator("button").filter(has_text="Close"))
        if await close_btn.count() > 0:
            await close_btn.first.click()
        else:
            await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)
    else:
        print("  -> No clickable team found, skipping...")

    # ── 9. Switch back to Match Day tab ───────────────────────────
    print("[9] Switching back to Match Day tab...")
    match_tab = page.locator("div").filter(has_text="Match Day").last
    await match_tab.click()
    await page.wait_for_timeout(1500)
    await screenshot(page, "09_matchday_tab")

    # ── 10. Click a match card to open Match Modal ────────────────
    print("[10] Clicking a match to open match modal...")
    match_cards = page.locator("[style*='cursor: pointer'], [style*='cursor:pointer']")
    if await match_cards.count() > 0:
        await match_cards.first.click()
        await page.wait_for_timeout(1500)
        await screenshot(page, "10_match_modal")

        close_btn = page.locator("button").filter(has_text="✕").or_(
            page.locator("button").filter(has_text="×")
        )
        if await close_btn.count() > 0:
            await close_btn.first.click()
        else:
            await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)

    # ── 11. Open World Cup Guide (footer) ─────────────────────────
    print("[11] Opening World Cup Guide...")
    guide_btn = page.locator("button").filter(has_text="World Cup Guide")
    if await guide_btn.count() > 0:
        await guide_btn.first.click(force=True)
        await page.wait_for_timeout(2000)
        await screenshot(page, "11_world_cup_guide")

        hide_guide = page.locator("button").filter(has_text="Hide Guide")
        if await hide_guide.count() > 0:
            await hide_guide.first.click(force=True)
            await page.wait_for_timeout(500)

    # ── 12. Open World Cup History (footer) ───────────────────────
    print("[12] Opening World Cup History...")
    history_btn = page.locator("button").filter(has_text="World Cup History")
    if await history_btn.count() > 0:
        await history_btn.first.click(force=True)
        await page.wait_for_timeout(2000)
        await screenshot(page, "12_world_cup_history")

        hide_history = page.locator("button").filter(has_text="Hide History")
        if await hide_history.count() > 0:
            await hide_history.first.click(force=True)
            await page.wait_for_timeout(500)

    # ── 13. Open About page ───────────────────────────────────────
    print("[13] Navigating to About page...")
    about_link = page.locator("a[href='/about.html']")
    if await about_link.count() > 0:
        async with context.expect_page() as new_page_info:
            await about_link.first.click()
        about_page = await new_page_info.value
        await about_page.wait_for_load_state("networkidle")
        await about_page.screenshot(path="screenshots/13_about_page.png", full_page=True)
        print("  -> Screenshot saved: screenshots/13_about_page.png")
        await about_page.close()

    # ── 14. Open Privacy Policy page ──────────────────────────────
    print("[14] Navigating to Privacy Policy page...")
    privacy_link = page.locator("a[href='/privacy.html']")
    if await privacy_link.count() > 0:
        async with context.expect_page() as new_page_info:
            await privacy_link.first.click()
        privacy_page = await new_page_info.value
        await privacy_page.wait_for_load_state("networkidle")
        await privacy_page.screenshot(path="screenshots/14_privacy_page.png", full_page=True)
        print("  -> Screenshot saved: screenshots/14_privacy_page.png")
        await privacy_page.close()

    # ── 15. Test mobile viewport ──────────────────────────────────
    print("[15] Testing mobile viewport...")
    await page.set_viewport_size({"width": 390, "height": 844})
    await page.wait_for_timeout(1500)
    await screenshot(page, "15_mobile_view")

    groups_tab_mobile = page.locator("div").filter(has_text="Groups").last
    await groups_tab_mobile.click()
    await page.wait_for_timeout(1000)
    await screenshot(page, "16_mobile_groups")

    await page.set_viewport_size({"width": 1440, "height": 900})
    await page.wait_for_timeout(500)


async def main():
    try:
        # ── Launch OBS with auto-recording ────────────────────────
        start_obs_recording()

        # ── Run Playwright navigation ─────────────────────────────
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=False, slow_mo=400)
            context = await browser.new_context(viewport={"width": 1440, "height": 900})
            page = await context.new_page()

            await navigate(page, context)

            print("\nDone - Navigation complete, all sections visited.")
            await page.wait_for_timeout(2000)
            await browser.close()

    finally:
        # ── Stop OBS ──────────────────────────────────────────────
        stop_obs_recording()


if __name__ == "__main__":
    asyncio.run(main())
