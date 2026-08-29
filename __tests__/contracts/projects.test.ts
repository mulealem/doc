import { describe, expect, it } from "vitest";
import {
  curlAdminCreateProject,
  curlAdminListProjects,
  curlCreateInvite,
  curlCreateWebhook,
  curlEnableBank,
  curlGetMyProject,
  curlRotateKey,
  curlUpdateMyProject,
  nodeAdminCreateProject,
  nodeEnableBank,
  pythonAdminCreateProject,
  pythonEnableBank,
} from "@/lib/examples/projects";
import {
  bankAccountCreated,
  errorBankAlreadyEnabled,
  errorInvalidAdminKey,
  errorMissingBearer,
  inviteCreated,
  projectCreated,
  projectList,
  projectRotatedKey,
  teamList,
  webhookCreated,
} from "@/lib/examples/responses";
import {
  bankAccountCreatedSchema,
  inviteCreatedSchema,
  projectCreatedSchema,
  projectListSchema,
  projectRotatedKeySchema,
  teamListSchema,
  webhookCreatedSchema,
} from "@/lib/schemas";

type PropSchema = { type: string | string[]; format?: string };
type Schema = {
  required: readonly string[];
  properties: Record<string, PropSchema>;
};

function assertMatchesSchema(value: unknown, schema: Schema, path = "$") {
  if (typeof value !== "object" || value === null) {
    throw new Error(`${path}: expected object, got ${typeof value}`);
  }
  const obj = value as Record<string, unknown>;
  for (const key of schema.required) {
    if (!(key in obj)) {
      throw new Error(`${path}: missing required field "${key}"`);
    }
  }
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (!(key in obj)) continue;
    const v = obj[key];
    const types = Array.isArray(prop.type) ? prop.type : [prop.type];
    const matches = types.some((t) => {
      if (t === "null") return v === null;
      if (t === "string") return typeof v === "string";
      if (t === "number") return typeof v === "number";
      if (t === "integer") return Number.isInteger(v);
      if (t === "boolean") return typeof v === "boolean";
      if (t === "array") return Array.isArray(v);
      if (t === "object") return typeof v === "object" && v !== null;
      return false;
    });
    if (!matches) {
      throw new Error(
        `${path}.${key}: expected ${types.join("|")}, got ${typeof v}`,
      );
    }
  }
}

describe("projects API examples use the right surface", () => {
  it("every snippet references the dashboard origin", () => {
    for (const ex of [
      curlAdminCreateProject,
      curlAdminListProjects,
      curlGetMyProject,
      curlUpdateMyProject,
      curlEnableBank,
      curlCreateWebhook,
      curlCreateInvite,
      curlRotateKey,
      nodeAdminCreateProject,
      nodeEnableBank,
      pythonAdminCreateProject,
      pythonEnableBank,
    ]) {
      expect(ex).toContain("https://dashboard.example.com/api/v1/");
    }
  });

  it("admin examples authenticate with a pka_ bearer token", () => {
    expect(curlAdminCreateProject).toMatch(/Authorization:\s*Bearer\s+pka_/i);
    expect(curlAdminListProjects).toMatch(/Authorization:\s*Bearer\s+pka_/i);
    // SDK-style snippets read the admin key from the environment instead of
    // embedding a literal key.
    expect(nodeAdminCreateProject).toMatch(
      /"Authorization":\s*"Bearer "\s*\+\s*process\.env\.PYGATE_ADMIN_KEY/,
    );
    expect(pythonAdminCreateProject).toMatch(/os\.environ\["PYGATE_ADMIN_KEY"\]/);
  });

  it("project examples authenticate with x-api-key", () => {
    for (const ex of [
      curlGetMyProject,
      curlUpdateMyProject,
      curlEnableBank,
      curlCreateWebhook,
      curlCreateInvite,
      curlRotateKey,
      nodeEnableBank,
      pythonEnableBank,
    ]) {
      expect(ex).toMatch(/x-api-key/i);
    }
  });

  it("mutations use the right HTTP methods", () => {
    expect(curlAdminCreateProject).toMatch(/POST/i);
    expect(curlAdminListProjects).not.toMatch(/-X\s+(POST|PUT|PATCH|DELETE)/i);
    expect(curlGetMyProject).not.toMatch(/-X\s+(POST|PUT|PATCH|DELETE)/i);
    expect(curlUpdateMyProject).toMatch(/PATCH/i);
    expect(curlEnableBank).toMatch(/POST/i);
    expect(curlCreateWebhook).toMatch(/POST/i);
    expect(curlCreateInvite).toMatch(/POST/i);
    expect(curlRotateKey).toMatch(/POST/i);
  });
});

describe("project create response", () => {
  it("matches the documented schema", () => {
    expect(() =>
      assertMatchesSchema(projectCreated, projectCreatedSchema),
    ).not.toThrow();
    expect(() =>
      assertMatchesSchema(projectCreated.project, projectCreatedSchema.properties.project),
    ).not.toThrow();
  });

  it("exposes a pgk_ api key", () => {
    expect(projectCreated.project.apiKey).toMatch(/^pgk_[0-9a-f]{16,64}$/);
  });

  it("has a valid ISO callbackUrl and timestamps", () => {
    expect(projectCreated.project.callbackUrl).toMatch(/^https:\/\//);
    expect(Number.isFinite(Date.parse(projectCreated.project.createdAt))).toBe(true);
    expect(Number.isFinite(Date.parse(projectCreated.project.updatedAt))).toBe(true);
  });
});

describe("project list response", () => {
  it("matches the documented schema", () => {
    expect(() => assertMatchesSchema(projectList, projectListSchema)).not.toThrow();
  });
  it("keeps total consistent with data length", () => {
    expect(projectList.total).toBe(projectList.data.length);
    expect(projectList.limit).toBe(20);
    expect(projectList.offset).toBe(0);
  });
});

describe("bank account create response", () => {
  it("matches the documented schema", () => {
    expect(() =>
      assertMatchesSchema(bankAccountCreated, bankAccountCreatedSchema),
    ).not.toThrow();
    expect(() =>
      assertMatchesSchema(
        bankAccountCreated.bankAccount,
        bankAccountCreatedSchema.properties.bankAccount,
      ),
    ).not.toThrow();
  });

  it("carries a CBE_BIRR phone number in 2519XXXXXXXX format", () => {
    expect(bankAccountCreated.bankAccount.type).toBe("CBE_BIRR");
    expect(bankAccountCreated.bankAccount.phoneNumber).toMatch(/^251\d{9}$/);
  });
});

describe("webhook create response", () => {
  it("matches the documented schema", () => {
    expect(() =>
      assertMatchesSchema(webhookCreated, webhookCreatedSchema),
    ).not.toThrow();
  });

  it("returns a whsec_ signing secret shown once", () => {
    expect(webhookCreated.webhook.signingSecret).toMatch(/^whsec_[0-9a-f]{16,64}$/);
    expect(webhookCreated.webhook.signingSecret.startsWith(webhookCreated.webhook.secretPrefix)).toBe(true);
  });

  it("only subscribes supported events", () => {
    for (const e of webhookCreated.webhook.events) {
      expect(["payment.approved", "payment.rejected"]).toContain(e);
    }
  });
});

describe("team invite response", () => {
  it("matches the documented schema", () => {
    expect(() => assertMatchesSchema(inviteCreated, inviteCreatedSchema)).not.toThrow();
  });

  it("inviteUrl embeds the token and lives on the dashboard origin", () => {
    expect(inviteCreated.inviteUrl).toContain(inviteCreated.token);
    expect(inviteCreated.inviteUrl).toMatch(/^https:\/\/dashboard\.example\.com\/invite\//);
  });

  it("only carries known permission flags", () => {
    const KNOWN = [
      "view_dashboard",
      "manage_settings",
      "manage_bank_accounts",
      "validate_payments",
      "create_invoice",
      "manage_support",
      "view_logs",
      "manage_team",
    ];
    for (const p of inviteCreated.permissions) expect(KNOWN).toContain(p);
  });
});

describe("team list response", () => {
  it("matches the documented schema", () => {
    expect(() => assertMatchesSchema(teamList, teamListSchema)).not.toThrow();
  });
});

describe("key rotation and error envelopes", () => {
  it("rotated key keeps the pgk_ format", () => {
    expect(() =>
      assertMatchesSchema(projectRotatedKey, projectRotatedKeySchema),
    ).not.toThrow();
    expect(projectRotatedKey.apiKey).toMatch(/^pgk_[0-9a-f]{16,64}$/);
  });

  it("errors use the { error } envelope", () => {
    for (const e of [errorInvalidAdminKey, errorMissingBearer, errorBankAlreadyEnabled]) {
      expect(typeof e.error).toBe("string");
      expect(e.error.length).toBeGreaterThan(0);
    }
  });
});
