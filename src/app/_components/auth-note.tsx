export default function AuthNote() {
  return (
    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-medium text-blue-800">
        How to Implement NextAuth.js
      </h3>
      <p className="mb-3 text-sm text-blue-700">
        To implement proper authentication with NextAuth.js, you would need to:
      </p>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-700">
        <li>
          Install NextAuth.js:{" "}
          <code className="rounded bg-blue-100 px-1">
            npm install next-auth
          </code>
        </li>
        <li>Set up environment variables for your auth providers</li>
        <li>
          Create an API route at{" "}
          <code className="rounded bg-blue-100 px-1">
            app/api/auth/[...nextauth]/route.ts
          </code>
        </li>
        <li>
          Configure your auth providers (Google, GitHub, credentials, etc.)
        </li>
        <li>Set up a database adapter for persistent sessions</li>
        <li>Implement session management and protected routes</li>
      </ol>
      <p className="mt-3 text-sm text-blue-700">
        For more information, visit the{" "}
        <a
          href="https://next-auth.js.org/getting-started/introduction"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          NextAuth.js documentation
        </a>
        .
      </p>
    </div>
  );
}
