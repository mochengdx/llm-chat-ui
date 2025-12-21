import { describe, expect, it } from "vitest";
import { extractUrls, isValidUrl } from "../../src/string/url";

describe("URL Utilities", () => {
  describe("extractUrls", () => {
    it("should return an empty array for empty input", () => {
      expect(extractUrls("")).toEqual([]);
    });

    it("should return an empty array when no URLs are present", () => {
      expect(extractUrls("Hello world, this is a test.")).toEqual([]);
    });

    it("should extract a single URL", () => {
      const text = "Check this: https://example.com";
      expect(extractUrls(text)).toEqual(["https://example.com"]);
    });

    it("should extract multiple URLs", () => {
      const text = "Visit https://google.com and http://github.com";
      expect(extractUrls(text)).toEqual(["https://google.com", "http://github.com"]);
    });

    it("should handle URLs with paths and query parameters", () => {
      const text = "Link: https://example.com/path?query=123&name=test";
      expect(extractUrls(text)).toEqual(["https://example.com/path?query=123&name=test"]);
    });

    it("should handle mixed content correctly", () => {
      const text = "Text https://a.com text http://b.org text";
      expect(extractUrls(text)).toEqual(["https://a.com", "http://b.org"]);
    });
  });

  describe("isValidUrl", () => {
    it("should return true for valid HTTP URLs", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
    });

    it("should return true for valid HTTPS URLs", () => {
      expect(isValidUrl("https://google.com")).toBe(true);
    });

    it("should return true for URLs with paths and queries", () => {
      expect(isValidUrl("https://example.com/path/to/resource?id=1")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("example.com")).toBe(false); // Missing protocol
      expect(isValidUrl("http://")).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(isValidUrl("")).toBe(false);
    });
  });
});
