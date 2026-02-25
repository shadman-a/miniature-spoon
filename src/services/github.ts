import { DatabaseUser } from '../types/db';

const GITHUB_API_BASE = 'https://api.github.com';

const getEnv = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const owner = import.meta.env.VITE_DB_OWNER;
  const repo = import.meta.env.VITE_DB_REPO;

  if (!token || !owner || !repo) {
    console.warn("GitHub DB configuration missing. Check .env variables.");
    return null;
  }
  return { token, owner, repo };
};

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

// Helper for robust Base64 encoding/decoding (supports Unicode)
const encodeBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte)
    ).join("");
    return btoa(binString);
};

const decodeBase64 = (base64: string): string => {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
};

export const fetchUserFile = async (username: string): Promise<{ data: DatabaseUser, sha: string } | null> => {
  const env = getEnv();
  if (!env) return null;

  const path = `users/${username}.json`;
  const url = `${GITHUB_API_BASE}/repos/${env.owner}/${env.repo}/contents/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${env.token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    if (response.status === 404) {
      return null; // User not found
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API Error (${response.status}):`, errorText);
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const json: GitHubFileResponse = await response.json();

    // GitHub API returns content with newlines often, remove them
    const cleanContent = json.content.replace(/\n/g, '');
    const decodedContent = decodeBase64(cleanContent);

    return { data: JSON.parse(decodedContent), sha: json.sha };
  } catch (error) {
    console.error("Error fetching user file:", error);
    throw error;
  }
};

export const saveUserFile = async (username: string, data: DatabaseUser, sha?: string): Promise<{ success: boolean, sha?: string }> => {
  const env = getEnv();
  if (!env) return { success: false };

  const path = `users/${username}.json`;
  const url = `${GITHUB_API_BASE}/repos/${env.owner}/${env.repo}/contents/${path}`;

  const content = encodeBase64(JSON.stringify(data, null, 2));

  const body: any = {
    message: sha ? `Update user ${username}` : `Create user ${username}`,
    content: content,
  };

  if (sha) {
    body.sha = sha;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${env.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("GitHub API Error on save:", errorText);
        throw new Error(`Failed to save: ${response.statusText}`);
    }

    const json = await response.json();
    return { success: true, sha: json.content.sha };
  } catch (error) {
    console.error("Error saving user file:", error);
    throw error;
  }
};
