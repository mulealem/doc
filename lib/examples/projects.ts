export const projectsApiBase = "https://dashboard.example.com/api/v1";

export const adminKey = "pka_test_4b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r";
export const projectKey = "pgk_test_4b1c2d3e4f5g6h7i";

/** POST /api/v1/admin/projects — admin tier creates a project. */
export const curlAdminCreateProject = `curl -X POST ${projectsApiBase}/admin/projects \\
  -H "Authorization: Bearer ${adminKey}" \\
  -H "content-type: application/json" \\
  -d '{
    "name": "Coffee Shop Demo",
    "callbackUrl": "https://merchant.example.com/payments/callback",
    "ownerEmail": "merchant@example.com",
    "bankAccounts": [
      {
        "type": "CBE",
        "accountName": "Demo Merchant",
        "accountNumber": "1000123456789"
      }
    ]
  }'`;

/** GET /api/v1/admin/projects — admin tier lists projects. */
export const curlAdminListProjects = `curl "${projectsApiBase}/admin/projects?limit=20&offset=0" \\
  -H "Authorization: Bearer ${adminKey}"`;

/** GET /api/v1/projects/me — project tier resolves its own project. */
export const curlGetMyProject = `curl ${projectsApiBase}/projects/me \\
  -H "x-api-key: ${projectKey}"`;

/** PATCH /api/v1/projects/me — project tier updates its settings. */
export const curlUpdateMyProject = `curl -X PATCH ${projectsApiBase}/projects/me \\
  -H "x-api-key: ${projectKey}" \\
  -H "content-type: application/json" \\
  -d '{
    "name": "Coffee Shop Demo (updated)",
    "theme": "emerald"
  }'`;

/** POST /api/v1/projects/{id}/bank-accounts — enable a bank. */
export const curlEnableBank = `curl -X POST ${projectsApiBase}/projects/prj_3x4mpl3t3st0rd3r1d2/bank-accounts \\
  -H "x-api-key: ${projectKey}" \\
  -H "content-type: application/json" \\
  -d '{
    "type": "CBE_BIRR",
    "accountName": "Demo Merchant",
    "accountNumber": "1000987654321",
    "phoneNumber": "251912345678"
  }'`;

/** POST /api/v1/projects/{id}/webhooks — subscribe a webhook. */
export const curlCreateWebhook = `curl -X POST ${projectsApiBase}/projects/prj_3x4mpl3t3st0rd3r1d2/webhooks \\
  -H "x-api-key: ${projectKey}" \\
  -H "content-type: application/json" \\
  -d '{
    "url": "https://merchant.example.com/webhooks/pygate",
    "events": ["payment.approved", "payment.rejected"]
  }'`;

/** POST /api/v1/projects/{id}/team/invites — mint an invite link. */
export const curlCreateInvite = `curl -X POST ${projectsApiBase}/projects/prj_3x4mpl3t3st0rd3r1d2/team/invites \\
  -H "x-api-key: ${projectKey}" \\
  -H "content-type: application/json" \\
  -d '{
    "email": "teammate@example.com",
    "permissions": ["view_dashboard", "manage_bank_accounts"]
  }'`;

/** POST /api/v1/projects/me/api-key — rotate the project key. */
export const curlRotateKey = `curl -X POST ${projectsApiBase}/projects/me/api-key \\
  -H "x-api-key: ${projectKey}"`;

/** Node fetch: create project as admin. */
export const nodeAdminCreateProject = `const res = await fetch(
  "${projectsApiBase}/admin/projects",
  {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.PYGATE_ADMIN_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Coffee Shop Demo",
      callbackUrl: "https://merchant.example.com/payments/callback",
      bankAccounts: [
        { type: "CBE", accountName: "Demo Merchant", accountNumber: "1000123456789" },
      ],
    }),
  },
);
const body = await res.json();
console.log(body.project.apiKey);`;

/** Node fetch: enable a bank account on a project. */
export const nodeEnableBank = `const res = await fetch(
  "${projectsApiBase}/projects/" + projectId + "/bank-accounts",
  {
    method: "POST",
    headers: {
      "x-api-key": process.env.PYGATE_PROJECT_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: "CBE_BIRR",
      accountName: "Demo Merchant",
      accountNumber: "1000987654321",
      phoneNumber: "251912345678",
    }),
  },
);`;

/** Python requests: create project as admin. */
export const pythonAdminCreateProject = `import requests

res = requests.post(
    "${projectsApiBase}/admin/projects",
    headers={
        "Authorization": "Bearer " + os.environ["PYGATE_ADMIN_KEY"],
        "Content-Type": "application/json",
    },
    json={
        "name": "Coffee Shop Demo",
        "callbackUrl": "https://merchant.example.com/payments/callback",
        "bankAccounts": [
            {"type": "CBE", "accountName": "Demo Merchant", "accountNumber": "1000123456789"}
        ],
    },
)
project = res.json()["project"]
print(project["apiKey"])`;

/** Python requests: enable a bank account on a project. */
export const pythonEnableBank = `import requests

res = requests.post(
    f"${projectsApiBase}/projects/{project_id}/bank-accounts",
    headers={"x-api-key": os.environ["PYGATE_PROJECT_KEY"]},
    json={
        "type": "CBE_BIRR",
        "accountName": "Demo Merchant",
        "accountNumber": "1000987654321",
        "phoneNumber": "251912345678",
    },
)
print(res.status_code)`;

/** GET /api/v1/orders/{orderId}/events — order lifecycle timeline. */
export const curlGetOrderEvents = `curl ${projectsApiBase}/orders/ord_3x4mpl3t3st0rd3r1d2/events \\
  -H "x-api-key: ${projectKey}"`;
