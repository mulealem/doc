import { describe, expect, it } from "vitest";
import { curlCreateOrder, curlGetOrder, curlVerify } from "@/lib/examples/curl";
import {
  nodeCreateOrder,
  nodeFetchImpl,
  nodeGetOrder,
  nodeVerify,
} from "@/lib/examples/node";
import {
  pythonCreateOrder,
  pythonGetOrder,
  pythonRequestsImpl,
  pythonVerify,
} from "@/lib/examples/python";
import {
  goCreateOrder,
  goGetOrder,
  goNetHttpImpl,
  goVerify,
} from "@/lib/examples/go";
import {
  phpCreateOrder,
  phpCurlImpl,
  phpGetOrder,
  phpVerify,
} from "@/lib/examples/php";

const all = {
  cURL: [curlCreateOrder, curlGetOrder, curlVerify],
  Node: [nodeCreateOrder, nodeGetOrder, nodeVerify, nodeFetchImpl],
  Python: [pythonCreateOrder, pythonGetOrder, pythonVerify, pythonRequestsImpl],
  PHP: [phpCreateOrder, phpGetOrder, phpVerify, phpCurlImpl],
  Go: [goCreateOrder, goGetOrder, goVerify, goNetHttpImpl],
};

describe("every example hits the documented base URL", () => {
  it("cURL examples reference the dashboard origin", () => {
    for (const ex of all.cURL) {
      expect(ex).toContain("https://dashboard.example.com/api/v1/");
    }
  });

  it("Node fetch example references the dashboard origin", () => {
    expect(nodeFetchImpl).toContain("https://dashboard.example.com/api/v1/");
  });

  it("Python requests example references the dashboard origin", () => {
    expect(pythonRequestsImpl).toContain(
      "https://dashboard.example.com/api/v1/",
    );
  });

  it("PHP cURL example references the dashboard origin", () => {
    expect(phpCurlImpl).toContain("https://dashboard.example.com/api/v1/");
  });

  it("Go net/http example references the dashboard origin", () => {
    expect(goNetHttpImpl).toContain("https://dashboard.example.com/api/v1/");
  });
});

describe("every example uses the documented auth header", () => {
  it("cURL examples use x-api-key", () => {
    for (const ex of all.cURL) {
      expect(ex).toMatch(/-H\s+["']x-api-key:/);
    }
  });
});

describe("every example sends the right HTTP method", () => {
  it("create-order uses POST", () => {
    expect(curlCreateOrder).toMatch(/POST/i);
    expect(nodeFetchImpl).toMatch(/method:\s*"POST"/);
    expect(pythonRequestsImpl).toMatch(/requests\.post\(/);
    expect(phpCurlImpl).toMatch(/CURLOPT_POST/);
    expect(goNetHttpImpl).toMatch(/http\.NewRequest\("POST",/);
  });

  it("get-order uses GET (no method override)", () => {
    expect(curlGetOrder).not.toMatch(/-X\s+(POST|PUT|PATCH|DELETE)/i);
    expect(curlGetOrder).toMatch(/https:\/\/dashboard\.example\.com\/api\/v1\/orders\//);
  });
});

describe("example bodies include the required fields", () => {
  it("create-order body has amount and description", () => {
    for (const ns of [all.cURL, all.Node, all.Python, all.PHP, all.Go]) {
      const create = ns[0];
      expect(create.toLowerCase()).toMatch(/amount/);
      expect(create.toLowerCase()).toMatch(/description/);
    }
  });

  it("verify body has reference (case-insensitive for Go's PascalCase fields)", () => {
    for (const ns of [all.cURL, all.Node, all.Python, all.PHP, all.Go]) {
      const verify = ns[2];
      expect(verify.toLowerCase()).toMatch(/reference/);
    }
  });
});
