import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

test("sponsors list contains all required sponsors with correct tiers in order", () => {
  const sponsorsDataPath = path.join(rootDir, "components", "sponsors", "SponsorsData.ts");
  const content = fs.readFileSync(sponsorsDataPath, "utf8");

  assert.ok(content.includes('tier: "diamond"'), "Diamond tier present");
  assert.ok(content.includes('tier: "platinum"'), "Platinum tier present");
  assert.ok(content.includes('tier: "gold"'), "Gold tier present");
  assert.ok(content.includes('tier: "silver"'), "Silver tier present");
  assert.ok(content.includes('tier: "bronze"'), "Bronze tier present");

  assert.ok(content.includes('name: "Reka"'), "Reka present");
  assert.ok(content.includes('name: "Bank of India"'), "Bank of India present");
  assert.ok(content.includes('name: "Exasol"'), "Exasol present");
  assert.ok(content.includes('name: "Bank of Baroda"'), "Bank of Baroda present");
  assert.ok(content.includes('name: "AEMS"'), "AEMS present");

  assert.ok(content.includes('logo: "/assets/bank-of-india.svg"'), "Bank of India logo path configured");
  assert.ok(content.includes('logo: "/assets/bank-of-baroda.svg"'), "Bank of Baroda logo path configured");
});

test("sponsor logo asset files exist in public directory", () => {
  const boiLogo = path.join(rootDir, "public", "assets", "bank-of-india.svg");
  const bobLogo = path.join(rootDir, "public", "assets", "bank-of-baroda.svg");
  const exasolLogo = path.join(rootDir, "public", "assets", "exasol-light.svg");
  const aemsLogo = path.join(rootDir, "public", "assets", "bronze-logo.svg");

  assert.ok(fs.existsSync(boiLogo), "bank-of-india.svg exists");
  assert.ok(fs.existsSync(bobLogo), "bank-of-baroda.svg exists");
  assert.ok(fs.existsSync(exasolLogo), "exasol-light.svg exists");
  assert.ok(fs.existsSync(aemsLogo), "bronze-logo.svg exists");
});

test("all sponsor logos are cached/baked as PNGs", () => {
  const bakedDir = path.join(rootDir, "public", "assets", "baked");
  const logos = [
    "reka-spons.png",
    "bank-of-india.png",
    "exasol-light.png",
    "bank-of-baroda.png",
    "bronze-logo.png",
  ];

  for (const file of logos) {
    assert.ok(fs.existsSync(path.join(bakedDir, file)), `Baked file ${file} exists`);
  }
});

test("globals.css has platinum tier styling", () => {
  const cssPath = path.join(rootDir, "app", "globals.css");
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes(".sponsor-tier--platinum"), ".sponsor-tier--platinum style rule exists");
});
