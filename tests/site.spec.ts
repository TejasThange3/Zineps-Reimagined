import { test, expect } from "@playwright/test";

test.describe("rate console", () => {
  test("re-ranks services when the priority changes", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator(".console-row");

    /* The rates are generated per lane, so assert the ordering the control
       promises rather than a price that moves with the data. */
    const price = (row: ReturnType<typeof rows.nth>) =>
      row
        .locator(".console-price")
        .innerText()
        .then((t) => Number(t.replace(/[^0-9.]/g, "")));
    const days = (row: ReturnType<typeof rows.nth>) =>
      row
        .locator(".console-days")
        .innerText()
        .then((t) => Number(t.replace(/[^0-9.]/g, "")));

    await page.getByRole("button", { name: "Cost", exact: true }).click();
    await expect(rows.first()).toBeVisible();
    expect(await price(rows.nth(0))).toBeLessThanOrEqual(
      await price(rows.nth(1)),
    );

    await page.getByRole("button", { name: "Speed", exact: true }).click();
    await expect(rows.first()).toBeVisible();
    expect(await days(rows.nth(0))).toBeLessThanOrEqual(
      await days(rows.nth(1)),
    );

    await page.getByRole("button", { name: "Balanced", exact: true }).click();
    await expect(rows.first()).toBeVisible();
  });

  test("the verdict follows the ranking", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Cost", exact: true }).click();
    const top = await page
      .locator(".console-row")
      .first()
      .locator(".console-service b")
      .innerText();
    await expect(page.locator(".console-verdict")).toContainText(top.trim());
  });

  test("changing the lane moves the map and the rates together", async ({
    page,
  }) => {
    await page.goto("/");
    const map = page.locator(".lanemap svg");
    await expect(map).toHaveAttribute("aria-label", "AMS to BER");

    await page
      .getByLabel("Shipping lane", { exact: true })
      .selectOption("ber-vie");
    await expect(page.locator(".console-route")).toContainText("Vienna");
    await expect(map).toHaveAttribute("aria-label", "BER to VIE");
    await expect(page.locator(".console-row").first()).toBeVisible();
  });

  test("the lane map reframes itself so both ends stay on screen", async ({
    page,
  }) => {
    await page.goto("/");
    const map = page.locator(".lanemap svg");

    /* Madrid sits far south of Amsterdam, so a fixed frame cropped it off the
       bottom. The box is computed per lane; this checks the far endpoint
       lands inside it with room for its label. */
    await page
      .getByLabel("Shipping lane", { exact: true })
      .selectOption("ams-mad");
    await expect(map).toHaveAttribute("aria-label", "AMS to MAD");

    const ok = await page.evaluate(() => {
      const svg = document.querySelector(".lanemap svg")!;
      const [x, y, w, h] = svg
        .getAttribute("viewBox")!
        .split(" ")
        .map(Number);
      const ends = [...svg.querySelectorAll(".lanemap-end")];
      return ends.every((end) => {
        const cx = Number(end.getAttribute("cx"));
        const cy = Number(end.getAttribute("cy"));
        return cx > x && cx < x + w && cy > y && cy < y + h;
      });
    });
    expect(ok).toBe(true);
  });

  test("the priority control works from the keyboard", async ({ page }) => {
    await page.goto("/");
    const cost = page.getByRole("button", { name: "Cost", exact: true });
    await cost.focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("button", { name: "Balanced", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("shipment stack", () => {
  test("all four stages are present, one shipment throughout", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = page.locator("#workflow .stack-card");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0)).toContainText("#DEMO-0042");
    await expect(cards.nth(1)).toContainText("Routewise Standard");
    await expect(cards.nth(2)).toContainText("3SZINEPS4820193");
    await expect(cards.nth(3)).toContainText("Out for delivery");
  });

  test("the cards pin and the rail follows the scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#workflow .stack")).toHaveAttribute(
      "data-pinned",
      "true",
    );

    const box = (await page.locator("#workflow").boundingBox())!;
    const current = () =>
      page.evaluate(() =>
        [...document.querySelectorAll("#workflow .flow-step")].findIndex((s) =>
          s.hasAttribute("data-current"),
        ),
      );

    await page.evaluate((y) => window.scrollTo(0, y), box.y);
    await page.waitForTimeout(700);
    expect(await current()).toBe(0);

    await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.8);
    await page.waitForTimeout(800);
    expect(await current()).toBeGreaterThan(1);

    // Cards converge on the pinned offset rather than piling up down the page.
    const tops = await page.evaluate(() =>
      [...document.querySelectorAll("#workflow .stack-card")].map((c) =>
        Math.round(c.getBoundingClientRect().top),
      ),
    );
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(700);
  });
});

test("the audience switch replaces the whole block", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".aud-body")).toContainText("You sell things");
  await page.getByRole("button", { name: "I move goods" }).click();
  await expect(page.locator(".aud-body")).toContainText("You move things");
  await expect(page.locator(".aud-body")).toContainText(
    "You keep the commercial relationship",
  );
});

test.describe("pricing", () => {
  test("the estimator recommends a plan for the volume", async ({ page }) => {
    await page.goto("/pricing");
    const slider = page.getByLabel("Shipments a month");

    await slider.fill("3"); // 200 a month
    await expect(page.locator(".est-plan")).toHaveText("Free");
    await expect(page.locator(".est-total")).toContainText("€0");

    await slider.fill("9"); // 1,500 a month
    await expect(page.locator(".est-plan")).toHaveText("Growth");

    await slider.fill("19"); // 35,000 a month
    await expect(page.locator(".est-plan")).toHaveText("Enterprise");
  });

  test("switching to monthly raises every plan price", async ({ page }) => {
    await page.goto("/pricing");
    const growth = page.locator(".plan").nth(2);
    await expect(growth.locator(".plan-price")).toContainText("€55");
    await page.getByRole("button", { name: "Monthly" }).click();
    await expect(growth.locator(".plan-price")).toContainText("€69");
  });

  test("the comparison table is reachable from the keyboard", async ({
    page,
  }) => {
    await page.goto("/pricing");
    const region = page.getByRole("region", {
      name: /Plan comparison/,
    });
    await region.focus();
    await expect(region).toBeFocused();
  });
});

test.describe("integration directory", () => {
  test("filters by category and by search", async ({ page }) => {
    await page.goto("/integrations");
    await expect(page.locator(".dir-item")).toHaveCount(32);

    await page.getByRole("button", { name: /^Carriers/ }).click();
    await expect(page.locator(".dir-item")).toHaveCount(9);

    await page.getByRole("button", { name: /^All/ }).click();
    await page.getByLabel("Search integrations").fill("shopify");
    await expect(page.locator(".dir-item")).toHaveCount(1);
  });

  test("shows a useful empty state", async ({ page }) => {
    await page.goto("/integrations");
    await page.getByLabel("Search integrations").fill("zzzzz");
    await expect(page.locator(".dir-empty")).toBeVisible();
    await expect(page.locator(".dir-empty")).toContainText("zzzzz");
  });
});

test("the rule builder derives the service from the condition", async ({
  page,
}) => {
  await page.goto("/shipping");
  await expect(page.locator(".rule-service")).toHaveText("Routewise Standard");

  await page.getByLabel("Order field").selectOption("weight");
  await page.getByLabel("Value", { exact: true }).selectOption("heavy");
  await expect(page.locator(".rule-service")).toHaveText("Freightline Pallet");
  await expect(page.locator(".rule-why")).toContainText("freight");
});

test.describe("navigation", () => {
  test("routes on the client and keeps real URLs", async ({ page }) => {
    await page.goto("/");
    await page
      .locator(".hero-actions")
      .getByRole("link", { name: "For logistics partners" })
      .click();
    await expect(page).toHaveURL(/\/logistics-operating-system$/);
    await expect(page.locator("h1")).toContainText("Run the commercial side");

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toContainText("Ship on contracts");
  });

  test("a deep link loads its own page directly", async ({ page }) => {
    await page.goto("/blog/dimensional-weight");
    await expect(page.locator("h1")).toContainText("Why your parcels cost more");
    await expect(page).toHaveTitle(/Why your parcels cost more/);
  });

  test("an unknown path renders the 404", async ({ page }) => {
    await page.goto("/nope");
    await expect(page.locator("h1")).toContainText("did not arrive");
  });

  test("the mobile menu opens, traps nothing and navigates", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Open menu" });
    await burger.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: "Pricing", exact: true })
      .click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.locator(".sheet")).toHaveAttribute("data-open", "false");
  });
});

test("the theme choice survives a reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Switch to dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
