import Layout from "../components/Layout";

const SecurityInfo = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Security Vulnerabilities Information</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="font-medium text-red-800">
            Warning: This application intentionally contains security vulnerabilities for testing and educational purposes.
            Do not use real credentials or sensitive information.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Password Security Vulnerabilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Passwords can be as short as 1 character</li>
              <li>Passwords longer than 64 characters are rejected</li>
              <li>Password truncation is applied without warning</li>
              <li>Unicode characters are not allowed in passwords</li>
              <li>Password change functionality is unreliable</li>
              <li>Current password verification is inconsistent</li>
              <li>No check against breached passwords</li>
              <li>No proper password strength meter</li>
              <li>Strict composition rules enforced</li>
              <li>Password rotation required</li>
              <li>Paste functionality and password managers discouraged</li>
              <li>No option to view password temporarily</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Input Validation Vulnerabilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>No protection against HTTP parameter pollution</li>
              <li>Vulnerable to mass parameter assignment</li>
              <li>No proper input validation (allowlists)</li>
              <li>No structured data validation</li>
              <li>Unvalidated redirects and forwards</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">File Upload & Execution Vulnerabilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Unlimited file size uploads</li>
              <li>Path traversal via user-submitted filenames</li>
              <li>Local File Inclusion (LFI) vulnerability</li>
              <li>Remote File Inclusion (RFI) vulnerability</li>
              <li>Reflective File Download (RFD) vulnerability</li>
              <li>OS command injection via file metadata</li>
              <li>Files stored inside web root</li>
              <li>No antivirus scanning of uploaded files</li>
              <li>Access to backup/source files</li>
              <li>Executable HTML/JavaScript content in downloads</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Logging & Error Handling Vulnerabilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Credentials and sensitive data in logs</li>
              <li>Detailed error messages exposed to users</li>
              <li>Stack traces revealed in error responses</li>
              <li>System information exposed in errors</li>
              <li>No generic error messages for security events</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityInfo;