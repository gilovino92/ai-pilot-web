import ky from "ky";

import { userManager } from "@/config/auth";

const fetchTimeout = import.meta.env.VITE_FETCH_CLIENT_TIMEOUT
  ? parseInt(import.meta.env.VITE_FETCH_CLIENT_TIMEOUT)
  : false;

const afetch = ky.create({
  hooks: {
    beforeRequest: [
      async (request) => {
        const user = await userManager.getUser();

        if (!user) {
          throw new Error("Unauthorized");
        }

        request.headers.set("Authorization", `Bearer ${user.access_token}`);
      },
    ],
  },
  timeout: fetchTimeout,
});

const ufetch = ky.create({
  timeout: import.meta.env.VITE_FETCH_CLIENT_TIMEOUT
    ? parseInt(import.meta.env.VITE_FETCH_CLIENT_TIMEOUT)
    : false,
});

export const tenant = afetch.extend({
  prefixUrl: import.meta.env.VITE_TENANT_API_BASE_URL,
});

export const utenant = ufetch.extend({
  prefixUrl: import.meta.env.VITE_TENANT_API_BASE_URL,
});

export const poc = afetch.extend({
  prefixUrl: import.meta.env.VITE_POC_API_BASE_URL,
});

export const upoc = ufetch.extend({
  prefixUrl: import.meta.env.VITE_POC_API_BASE_URL,
});

export const chatbot = afetch.extend({
  prefixUrl: import.meta.env.VITE_CHATBOT_API_BASE_URL,
});

export const prospect = afetch.extend({
  prefixUrl: import.meta.env.VITE_LEAD_SOURCING_API_BASE_URL,
});
